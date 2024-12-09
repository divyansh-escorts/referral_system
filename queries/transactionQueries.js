const fetchModels= require('./fetchModels')

async function addTransaction(user_id,amount) {
    const Models = await fetchModels();
    return await Models.Transaction.create({
        amount,user_id
    })
}

module.exports={addTransaction};