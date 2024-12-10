const bcrypt =require('bcrypt');
const crypto = require('crypto');
const router = require('express').Router();
const jwt = require('jsonwebtoken')

const { fetchDuplicates,createUser,updateReferredCount} = require('../queries/authQueries.js');
const {findReferrer} = require('../queries/userQueries.js');

function validE(e) {
    const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patt.test(e);
  }
  
router.post('/register', async(req, res)=>{
    console.log('POST /authenticate/register request');
    const {email,name,password,referrer} = req.body    
    try {
        if(!email && !name && !password)
        return res.json({success: false, message: 'Missing parameter'})
        if(!validE(email))  // checks for valid email
        return res.json({success: false, message: 'Invalid E-mail'})
        if(password.length<8)  // checks for valid password length i.e >8
        return res.json({success: false, message: 'Password Should be 8 letters long'})
        let duplicate = await fetchDuplicates(email) // checks if email is already registered.
        if(duplicate.length) return res.json({success: false, message: 'User already exists.'})
        encryptedPassword = await bcrypt.hash(password, 10)
        if(!referrer)  // if referrer is not included during signup
        {
            await createUser(email,encryptedPassword,name,referrer,0,0,true)
            return res.json({success: true, message: 'User created successfully without referrer'})
        }
        else
        {
            let user =await findReferrer(referrer);
            console.log(user[0]?.dataValues)
            user=user[0]?.dataValues;
            if(user.referred_count==8)  // if the refferer has already referred 8 candidates, then it should not be able to refer more
            return res.json({success: true, message: `The referrer can not refer more candidates`}) 
            if(typeof user?.level === 'number') 
            {
                await createUser(email,encryptedPassword,name,user?.id,user?.level+1,0,true);
                await updateReferredCount(user?.id)  // increases the count of referred people.
                return res.json({success: true, message: `User created successfully with ${user.name}'s referral`})
            }
            else
                await createUser(email,encryptedPassword,name,user?.id,0,0,true);
                return res.json({success: true, message: 'User created successfully without referrer'})
        } 
    } catch(err) {

        console.log('Error in registering user', err);
        return res.json({success:false, message:'Please try again after sometime.'})
    }
})
router.post('/login',async(req, res)=> {
    console.log('POST  /authenticate/login request');
    const {email, password} = req.body
    let user = await fetchDuplicates(email);  // checks if any user exists with such email or not.
    console.log(user[0].dataValues)
    user = user[0]
    if(user===undefined) {
        return res.json({success: false, message: 'Email/Password Invalid.'})
    }
    bcrypt.compare(password, user.password, async(bcryptErr, result)=>{ // compares the encrypted passowrd stored in the DB with the user provided password.
        if(bcryptErr) {
            console.error('bcrypt Error', bcryptErr);
            return res.json({success: false, message:'Please try again after sometime.'})
        }
        if(result) {
            // If password matches
            console.log('Login Successful');
            // let secrets = await fetchSecrets()
            const token = jwt.sign({ // creates a JWT token for successful signin.
                name: user.name,
                email:user.email,
            }, process.env.JWT_SECRET_USER) // it uses a secret key to encrypt.
            return res.json({success: true, token})
        } else {
            console.log('Incorrect Password');
            return res.json({success: false, message: 'Email/Password Invalid.'})
        }
    })
})


module.exports = router