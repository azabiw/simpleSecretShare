const express = require('express')
const fs = require('fs');
const app = express();
const path = require('path');

const config = require("./sampleConfig.js").config;
console.log(config);

const password = config.password;
const filePath = path.basename(config.files[0]); 
//TODO LOG INJEKTIOLTA yms suojautuminen

app.get('/', function (req, res) {
  res.send('Main page');
})


app.get("/vault/:key", (req, res) => {
    const requestKey = req.params.key;
    console.log(`ATTEMT | Request with key ${requestKey}`);

    if (requestKey === password) {
        console.log(`SUCCESS | Succesfull request with key ${requestKey}`);


        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.send("File read failed");
            }
            console.log("INFO | reading file");
            res.send(""+ data);

          });


    } else {
        console.error(`INCORRECT KEY | key ${requestKey}`);
        res.sendStatus(403);
    }
});
app.listen(3000)