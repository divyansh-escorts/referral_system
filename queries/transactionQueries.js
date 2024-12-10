const fetchModels= require('./fetchModels')

async function addTransaction(user_id,amount) {
    const Models = await fetchModels();
    return await Models.Transaction.create({    // creates a entry for each transactions irrespective of if the profits are transfered or not.
        amount,user_id
    })
}

module.exports={addTransaction};