const fetchModels= require('./fetchModels') 

async function checkUserParent(id) {      // cehck parent of the user
    const Models = await fetchModels(); 
    return await Models.User.findAll({
        where: {id}
    })
}
async function findReferrer(referrer_id) {   // check of the referrer is present or not || basically is the particular ID is present or not 
    const  Models = await fetchModels(); 
    return await Models.User.findAll({
        where: {id:referrer_id}
    })
}
async function updateUserStatus(active,id) {  // it updates the status os the user from active to inactive and vice-versa.
    const Models = await fetchModels()
    return await Models.User.update({
        active
    },{where:{id}})
}

module.exports={checkUserParent,findReferrer,updateUserStatus};