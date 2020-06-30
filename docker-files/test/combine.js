const fs = require('fs');

function main(){

    const result1 = fs.readFileSync("/home/jorgen/Desktop/hadoop_result").toString();
    const result2 = fs.readFileSync("/home/jorgen/Desktop/hadoop_result").toString();

    const nSplit1 = (result1.split("\n"));
    const tSplit1 = [];
    const obj1 = {};

    for (let i=0; i < nSplit1.length; i++){
        tSplit1.push(nSplit1[i].split("\t"));
        if (Number.isNaN(parseInt(tSplit1[i][1]))) {
            continue;
        }
        obj1[tSplit1[i][0]] = parseInt(tSplit1[i][1]);
    }

    const nSplit2 = (result2.split("\n"));
    const tSplit2 = [];
    const obj2 = {};

    for (let i=0; i < nSplit2.length; i++){
        tSplit2.push(nSplit2[i].split("\t"));
        if (Number.isNaN(parseInt(tSplit2[i][1]))) {
            continue;
        }
        obj2[tSplit2[i][0]] = parseInt(tSplit2[i][1]);
    }

    const mergedObj = {};
    const keys2 = Object.keys(obj2);

    for (let i=0; i < keys2.length; i++){
        var key = keys2[i];
        if (key in obj1) {
            mergedObj[key] = obj1[key] + obj2[key];
        } else {
            mergedObj[key] = obj2[key];
        }
    }

    const keys1 = Object.keys(obj1);
    for (let i=0; i < keys1.length; i++){
        var key = keys1[i];
        if (!(keys1[i] in obj2)) {
            mergedObj[key] = obj1[key]
        } else {
            continue;
        }
    }

    console.log(JSON.stringify(mergedObj));
    

}

main();