const bcrypt =require('bcrypt');
const crypto = require('crypto');
const router = require('express').Router();
const fetchSecrets = require('../middlewares/fetchSecrets');
const jwt = require('jsonwebtoken')

const { fetchDuplicates,createUser,updateReferredCount} = require('../queries/authQueries.js');

const {findReferrer} = require('../queries/userQueries.js');
router.post('/register', async(req, res)=>{
    console.log('POST /authenticate/register request');
    const {email,name,password,referrer} = req.body
    try {
        if(!email && !name && !password)
        return res.json({success: false, message: 'Missing parameter'})
        let duplicate = await fetchDuplicates(email)
        if(duplicate.length) return res.json({success: false, message: 'User already exists.'})
        encryptedPassword = await bcrypt.hash(password, 10)
        if(!referrer)
        {
            await createUser(email,encryptedPassword,name,referrer,0,0)
            return res.json({success: true, message: 'User created successfully without referrer'})
        }
        else
        {
            let user =await findReferrer(referrer);
            console.log(user[0]?.dataValues)
            user=user[0]?.dataValues;
            if(typeof user?.level === 'number')
            {
                await createUser(email,encryptedPassword,name,user?.id,user?.level+1,0);
                await updateReferredCount(user?.id)
                return res.json({success: true, message: `User created successfully with ${user.name}'s referral`})
            }
            else
                await createUser(email,encryptedPassword,name,user?.id,0,0);
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
    let user = await fetchDuplicates(email);
    console.log(user[0].dataValues)
    user = user[0]
    if(user===undefined) {
        return res.json({success: false, message: 'Email/Password Invalid.'})
    }
    bcrypt.compare(password, user.password, async(bcryptErr, result)=>{
        if(bcryptErr) {
            console.error('bcrypt Error', bcryptErr);
            return res.json({success: false, message:'Please try again after sometime.'})
        }
        if(result) {
            // If password matches
            console.log('Login Successful');
            let secrets = await fetchSecrets()
            const token = jwt.sign({
                name: user.name,
                email:user.email,
            }, secrets.JWT_SECRET_USER)
            return res.json({success: true, token})
        } else {
            console.log('Incorrect Password');
            return res.json({success: false, message: 'Email/Password Invalid.'})
        }
    })
})

module.exports = router