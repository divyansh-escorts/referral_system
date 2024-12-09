const fetchModels= require('./fetchModels')

async function checkUserParent(id) {
    const Models = await fetchModels();
    return await Models.User.findAll({
        where: {id}
    })
}
async function findReferrer(referrer_id) {
    const Models = await fetchModels();
    return await Models.User.findAll({
        where: {id:referrer_id}
    })
}

module.exports={checkUserParent,findReferrer};