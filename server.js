'use strict';
require('dotenv').config();
var http = require('http');
var port = process.env.PORT || 1337;
const fs = require("fs");
const os = require("os");
var cron = require('node-cron');

cron.schedule('*/2 * * * *', () => {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync(".env", "utf8").split(os.EOL);

    //calculating 
    let afterCal = (process.env.PECCALA_VALUE * 2 + 1.5) / 7.5;

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp("PECCALA_VALUE"));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `PECCALA_VALUE = ${afterCal}`);

    // write everything back to the file system
    fs.writeFileSync(".env", ENV_VARS.join(os.EOL));

    //generating logs
    generatingLogs('info', process.env.PECCALA_VALUE, afterCal);

});

function generatingLogs(type, beforeCalculate, afterCalculate) {
    let logMessage = "PECCALA_VALUE before calculate is: " + beforeCalculate;
    logMessage += " PECCALA_VALUE after calculate is: " + afterCalculate;
    logMessage += "," + type;
    logMessage += "," + new Date();
    logMessage += ", \r\n";
    fs.appendFileSync("logs.csv", logMessage);
}

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World test \n');
}).listen(port);