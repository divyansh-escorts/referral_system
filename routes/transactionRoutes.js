
const checkAuth= require('../middlewares/userAuth')
const { checkUserParent} = require('../queries/userQueries');
const { addProfitToParent,getEarningTotal, getEarningTransactionsById} = require('../queries/earningQueries');
const {addTransaction} = require('../queries/transactionQueries');
const router = require('express').Router();

router.post('/',checkAuth, async(req, res)=>{
    console.log('POST /transaction/ request');
    try {
            const {amount}=req.body;
            let user= req.userData;
            user= user[0].dataValues;
            console.log(user);
            if(amount>=1000)
            {
                if(user?.referrer_id && user.active)
                {

                    await addProfitToParent((amount*5)/100,user?.referrer_id,user?.id,1);
                    console.log("Profit Transfered to parent");
                }
                let parent = await checkUserParent(user?.referrer_id);
                parent=parent[0]?.dataValues;
                console.log(parent)
                if(parent?.referrer_id && parent.active)
                {
                    await addProfitToParent((((amount*5)/100)*1)/100,parent?.referrer_id,user?.id,2);
                    console.log("Profit Transfered to grandparent")
                }
                await addTransaction(user.id,amount)
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
            let stats=await getEarningTotal(user.id);
            let transactions = await getEarningTransactionsById(user.id);
            console.log(stats,transactions);
            return res.json({success:true,stats:stats[0],transactions:transactions[0]})
        } 
    catch(err) {
        console.log('Error in getting the earning reports.', err);
        return res.json({success:false, message:'Please try again after sometime.'})
    }})

module.exports = router