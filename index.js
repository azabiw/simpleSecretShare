const express = require('express')
const fs = require('fs');
const app = express();
const path = require('path');

const config = require("./sampleConfig.js").config;
console.log(config);

const password = config.password;
const fileNames = config.files;


//TODO LOG INJEKTIOLTA yms suojautuminen
app.set('view engine', 'pug');


if (password === undefined || config === undefined || config === {}) {
    console.error("ERROR | Failed loading the config object\n stopping process");
    process.exit(1);
}

app.get('/', function (req, res) {
  res.send('Main page');
})


app.get("/vault/:key", (req, res) => {
    const requestKey = req.params.key;
    console.log(`ATTEMT | Request with key ${requestKey}`);

    if (requestKey === password) {
        console.log(`SUCCESS | Succesfull request with key ${requestKey}`);
        res.render("fileListing", {
            files:config.files,
            key:requestKey
        })
    } else {
        console.error(`INCORRECT KEY | key ${requestKey}`);
        res.sendStatus(403);
    }
});

app.get("/vault/:key/:file", (req, res) => {
    const requestKey = req.params.key;
    const fileName = req.params.file.trim();
    console.log(`ATTEMT | Request with key ${requestKey}`);

    if (requestKey === password) {
        console.log(`SUCCESS | Succesfull request with key ${requestKey}`);

        if (fileNames.includes(fileName)) {
            const filePath = path.basename(fileName); 

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error(err);
                    res.send("File read failed");
                }
                console.log(`INFO | sending file ${filePath}`);
               res.send(""+data);
              });
        } else {
            console.error(`ERROR | failed matching file name with given name ${fileName}`);
            res.sendStatus(404);
        }
        
    } else {
        console.error(`INCORRECT KEY | key ${requestKey}`);
        res.sendStatus(403);
    }
});


app.listen(config.port ? config.port : 3000);
