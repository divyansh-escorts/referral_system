const fetchModels= require('./fetchModels')

async function fetchDuplicates(email) {
    const Models = await fetchModels();
    return await Models.User.findAll({  // fetches all the users with email same as argument
        where: {email}
    })
}

async function createUser(email,password,name,referrer,level,referred_count,active) {
    const Models = await fetchModels()
    return await Models.User.create({
        email,name,referrer_id:referrer,password,level,referred_count,active  // creates new user 
    })
}

async function updateReferredCount(id) {
    const Models = await fetchModels()
    return await Models.User.increment('referred_count', { by: 1, where: { id} });   // updates the count of referred candidates.
}

module.exports={fetchDuplicates,createUser,updateReferredCount};