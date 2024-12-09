const fetchModels= require('./fetchModels')

async function fetchDuplicates(email) {
    const Models = await fetchModels();
    return await Models.User.findAll({
        where: {email}
    })
}

async function createUser(email,password,name,referrer,level,referred_count) {
    const Models = await fetchModels()
    return await Models.User.create({
        email,name,referrer_id:referrer,password,level,referred_count
    })
}

async function updateReferredCount(id) {
    const Models = await fetchModels()
    return await Models.User.increment('referred_count', { by: 1, where: { id} });
}

module.exports={fetchDuplicates,createUser,updateReferredCount};