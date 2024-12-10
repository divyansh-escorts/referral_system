const bcrypt =require('bcrypt');
const crypto = require('crypto');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { updateUserStatus } = require('../queries/userQueries');
const checkAuth = require('../middlewares/userAuth');

router.post('/setActive/:id',checkAuth,async(req, res)=> {
    const id= req.params.id;
    console.log(`POST  /setActive/:${id} request`);
    try{
        console.log(req.userData[0].dataValues.id,id)
        if(req.userData[0].dataValues.id!=id)  // if the user who is caling the API is trying to set the status of someother user.
        return res.json({success:true,message:"You are not authorised to change the status of other users"})
        if(req.userData[0].dataValues.active)
        return res.json({success:true,message:"User is already active"})  
        await updateUserStatus(true,id);
        return res.json({success:true,message:"User is set to active"});
    }
    catch(err)
    {
        console.log('error in setting the user as active')
        return res.json({success:false,message:"Erorr in setting the status to active"})
    }
})

router.post('/setInactive/:id',checkAuth,async(req, res)=> {
    const id= req.params.id;
    console.log(`POST  /setInactive/:${id} request`);
    try{
        if(req.userData[0].dataValues.id!=id)   // if the user who is caling the API is trying to set the status of someother user.
        return res.json({success:true,message:"You are not authorised to change the status of other users"})
        if(!req.userData[0].dataValues.active)
        return res.json({success:false,message:"User is already Inactive"})  
        await updateUserStatus(false,id);
        return res.json({success:true,message:"User is set to Inactive"});
    }
    catch(err)
    {
        console.log('error in setting the user as Inactive')
        return res.json({success:false,message:"Erorr in setting the status to active"})
    }
})

module.exports = router