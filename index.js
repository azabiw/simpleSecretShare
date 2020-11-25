const express = require('express')
const fs = require('fs');
const app = express();
const path = require('path');
const TEMP_PASSWORD = "asd";
const FILE_PATH = path.basename("dummy_secret.txt", "");

//TODO LOG INJEKTIOLTA yms suojautuminen

app.get('/', function (req, res) {
  res.send('Main page');
})


app.get("/vault/:key", (req, res) => {
    const requestKey = req.params.key;
    console.log(`ATTEMT | Request with key ${requestKey}`);

    if (requestKey === TEMP_PASSWORD) {
        console.log(`SUCCESS | Succesfull request with key ${requestKey}`);


        fs.readFile(FILE_PATH, (err, data) => {
            if (err) {
                console.error(err);
                res.send("File read failed");
                break;
            }
            console.log("INFO | reading file");
            res.send(data);

          });


    } else {
        console.error(`INCORRECT KEY | key ${requestKey}`);
        res.sendStatus(403);
    }
});
app.listen(3000)