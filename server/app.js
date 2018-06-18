const express = require('express');
const fs = require('fs');
const app = express();

// write your logging code here
app.use((req, res, next) => {
    var agent = req.headers['user-agent'];
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion;
    var status = "200";
    var logLine = `${agent},${time},${method},${resource},${version},${status}\n`;

    fs.appendFile('./log.csv', logLine, err => {
        if (err) {
            throw err;
        } next();
    });
    console.log(logLine);
});

// write your code to respond "ok" here
app.get('/', (req, res) => {
    res.send("ok")
});

// write your code to return a json object containing the log data here
app.get('/logs', (req, res) => {
    fs.readFile("log.csv", "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        var output = data.split('\n');
       output.shift();
       output.pop();
       var jsonOutput = [];

       output.forEach(line => {
           var contents = line.split(',');

           var jsonLine = {
               'Agent': contents[0],
               'Time': contents[1],
               'Method': contents[2],
               'Resource': contents[3],
               'Version': contents[4],
               'Status': contents[5],
           };
           if (contents[0] !== ""){
            jsonOutput.push(jsonLine);
           }
        });

       res.json(jsonOutput);
    });
});

module.exports = app;
