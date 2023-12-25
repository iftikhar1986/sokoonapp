var con = require('../connection/connection')
var models = require('../models/models')

function allsync() {
    con.connection.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function adminssync() {
    models.admins.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('admins connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function citiessync() {
    models.cities.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('cities connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}
function statessync() {
    models.states.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('states connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}
function countriessync() {
    models.countries.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('countries connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function adssync() {
    models.ads.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('ads connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function categoriessync() {
    models.categories.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('categories connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function newWordssync() {
    models.newWords.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('newWords connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}


function notificationssync() {
    models.notifications.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('notifications connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function feedbackssync() {
    models.feedbacks.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('feedbacks connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function guidessync() {
    models.guides.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('guides connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function sentencessync() {
    models.sentences.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('sentences connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function settingssync() {
    models.settings.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('settings connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function signssync() {
    models.signs.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('signs connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function storiessync() {
    models.stories.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('stories connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function userGuidessync() {
    models.userGuides.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('userGuides connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function updateWordssync() {
    models.updateWords.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('updateWords connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function userssync() {
    models.users.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('users connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

function wordssync() {
    models.words.sync({
        logging: console.log,
        force: true
    })
        .then(() => {
            console.log('words connection established.......')
        })
        .catch(err => {
            console.log('unable to connect:', err)
        })
}

 function syncc(){
   allsync
//    adminssync;
//    citiessync;
//    statessync;
//    countriessync;
//    adssync;
//    categoriessync;
//    guidessync;
//    feedbackssync;
//    newWordssync;
//    notificationssync;
//    sentencessync;
//    settingssync;
//    signssync;
//    storiessync;
//    userGuidessync;
//    updateWordssync;
//    userssync;
//    wordssync;
 };
 syncc();

//Sync Tables
module.exports.allsync=allsync;
module.exports.adminssync=adminssync;
module.exports.citiessync=citiessync;
module.exports.statessync=statessync;
module.exports.countriessync=countriessync;
module.exports.adssync=adssync;
module.exports.categoriessync=categoriessync;
module.exports.guidessync=guidessync;
module.exports.feedbackssync=feedbackssync;
module.exports.newWordssync=newWordssync;
module.exports.notificationssync=notificationssync;
module.exports.sentencessync=sentencessync;
module.exports.settingssync=settingssync;
module.exports.signssync=signssync;
module.exports.storiessync=storiessync;
module.exports.userGuidessync=userGuidessync;
module.exports.updateWordssync=updateWordssync;
module.exports.userssync=userssync;
module.exports.wordssync=wordssync;