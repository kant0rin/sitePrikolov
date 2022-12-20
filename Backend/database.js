//
// это костыль. Нужен потому, что на хостинге нет поддержки postgresql.
// Файл с postgres кодом называется database_postgres.js
//

const fs = require("fs");
const file = require("./picksdb.json");

function setFeedbackToDB(pic, feedback) {
    let file = require('./picksdb.json');
    if (!file[pic]) {
        file[pic] = [0, 0];
    }
    if (feedback == "like") {
        file[pic][0] += 1;
    } else if (feedback == "dislike") {
        file[pic][1] += 1;
    }
    fs.writeFileSync("picksdb.json", JSON.stringify(file));
    return getFeedbackOfDB(pic);
}

function getFeedbackOfDB(pic) {
    let file = require('./picksdb.json');
    if (!file[pic]) {
        file[pic] = [0, 0];
        fs.writeFileSync("picksdb.json", JSON.stringify(file));
    }
    return [file[pic][0], file[pic][1]];
}

function getUserByLoginFromDB(login){
    let file = require('./usersdb.json');
    if (!file[login]){
        return 0;
    }
    return file[login];
}

function addUserToDB(login, hashedPassword){
    let file = require('./usersdb.json');
    if (file[login]){
        return 0;
    }
    file[login] = hashedPassword;
    fs.writeFileSync("usersdb.json", JSON.stringify(file));
    return 'Successful';
}

module.exports.addUserToDB = addUserToDB;
module.exports.getUserByLoginFromDB = getUserByLoginFromDB;
module.exports.setFeedbackToDB = setFeedbackToDB;
module.exports.getFeedbackOfDB = getFeedbackOfDB;
