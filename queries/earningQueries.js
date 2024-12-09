const fetchModels= require('./fetchModels')
const { fn, literal, where, Sequelize, Model } = require('sequelize');

async function addProfitToParent(amount,user_id,source_user_id,level) {
    const Models = await fetchModels();
    return await Models.Earning.create({
        amount,user_id,source_user_id,level
    })
}

async function getEarningTotal(user_id) {
    const Models = await fetchModels();
    const sequelize =Models.sequelize;
    const  res= await sequelize.query(`SELECT
    SUM(CASE WHEN level = 1 THEN amount ELSE 0 END) AS direct_earning,
    SUM(CASE WHEN level = 2 THEN amount ELSE 0 END) AS indirect_earning
FROM
    public."Earnings" WHERE user_id=${user_id}`,
    {
        type: sequelize.QueryTypes.SELECT
    });
    return res;
}
async function getEarningTransactionsById(user_id) {
    const Models = await fetchModels();
    const sequelize =Models.sequelize;
    const  res= await sequelize.query(`SELECT
    e1.id,  
    e1.user_id AS receiver_id,
    u1.name AS receiver_name,
    e1.source_user_id AS sender_id,
    u2.name AS sender_name,
    e1.amount
FROM public."Earnings" e1
JOIN public."Users" u1 ON e1.user_id = u1.id JOIN public."Users" u2 ON e1.source_user_id = u2.id
WHERE e1.user_id = ${user_id}
ORDER BY e1."createdAt";
`);
    return res;
}

module.exports={addProfitToParent,getEarningTotal,getEarningTransactionsById};