
const checkAuth= require('../middlewares/userAuth')
const { checkUserParent} = require('../queries/userQueries');
const { addProfitToParent,getEarningTotal, getEarningTransactionsById} = require('../queries/earningQueries');
const {addTransaction} = require('../queries/transactionQueries');
const router = require('express').Router();

router.post('/',checkAuth, async(req, res)=>{
    console.log('POST /transaction/ request');
    try {
            const {amount}=req.body;  // fetched the amount as received from the request body
            let user= req.userData;     // 
            user= user[0].dataValues;
            console.log(user);   // prints the caliing user
            let parent1 = await checkUserParent(user?.referrer_id);
                parent1=parent1[0]?.dataValues;
                console.log(parent1)
            if(amount>=1000)   // the transaction continues inly when the amount is >1000
            {
                if(user?.referrer_id && parent1.active)   // if the referrer is present and is active too then only proceed with the transaction
                {

                    await addProfitToParent((amount*5)/100,user?.referrer_id,user?.id,1);  // add 5% profit to the referrer 
                    console.log("Profit Transfered to parent");
                }
                let parent2 = await checkUserParent(parent1?.referrer_id);
                parent2=parent2[0]?.dataValues;
                console.log(parent2)
                if(parent1?.referrer_id && parent2.active)//  if the referrer's parent is present and is active too then only proceed with the transaction
                {
                    await addProfitToParent((((amount*5)/100)*1)/100,parent1?.referrer_id,user?.id,2);   // add 1% of the  profit made by referrer to the referrer's parent 
                    console.log("Profit Transfered to grandparent")
                }
                await addTransaction(user.id,amount)   // record the transaction in seperate Transaction table
                return res.json({success:true,message:"Transaction executed succesfully"}) 
            }
            else
            {

                return res.json({success:true,message:"Purchased amount in less than 1000. Transaction executed successfully"})
            }
        } 
    catch(err) {
        console.log('Error in performing the transaction', err);
        return res.json({success:false, message:'Please try again after sometime.'})
    }})

router.get('/',checkAuth, async(req, res)=>{
    console.log('GET /transaction/ request');
    try {
            let user= req.userData;
            user= user[0].dataValues;
            console.log(user);
            let stats=await getEarningTotal(user.id);  // fetches the indirect and direct earning 
            let transactions = await getEarningTransactionsById(user.id); // fetched the transactions happended between from user.id to everyone else.
            console.log(stats,transactions);
            return res.json({success:true,stats:stats[0],transactions:transactions[0]})  
        } 
    catch(err) {
        console.log('Error in getting the earning reports.', err);
        return res.json({success:false, message:'Please try again after sometime.'})
    }})

module.exports = router