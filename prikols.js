let prikolsFolder = './prikoli/';
let fs = require('fs');

//возвращает промис
function getRandomPrikol() {

    return new Promise(function(resolve, reject) {
        fs.readdir(prikolsFolder, function (err, files) {
            let rp = files[Math.floor(Math.random() * files.length)];
            resolve(rp);
        });
    });
    // let randomPrikol;
    // fs.readdir(prikolsFolder, function (err, files) {
    //     let rp = files[Math.floor(Math.random() * files.length)];
    //     callback(rp);
    //     return rp;
    // });
    // console.log(rp)
    // console.log(randomPrikol + '*');
    // return randomPrikol;
    //console.log(randomPrikol);
    //return randomPrikol.directory;
}

module.exports.getRandomPrikol = getRandomPrikol;






/*
// массив приколов
const prikols = ['прикол1', 'прикол2', 'прикол3', 'прикол4', 'прикол5'];

// получение рандомного элемента из массива
function getRandomElementOfArray(arr) {
    return Math.floor(Math.random() * arr.length);
}


// рандомный прикол из массива
function getRandomPrikol() {
    return prikols[getRandomElementOfArray(prikols)];
}
*/