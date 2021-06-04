'use strict';

const express = require("express");
const bodyparser = require("body-parser");
const http = require('http');
const historyport = 3000;
const historyhost = 'stateHistory';
const historypath = '/history';
const stateport = 8080;
const statehost = 'db';
const statepath = '/bots';
const app = express();

app.use(bodyparser.json());

app.post("/core", function (req, res) {
   

    const data = JSON.stringify(req.body);

    const stateoptions = {
        hostname: statehost,
        port: stateport,
        path: statepath + "/" + req.body.id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    var historyoption = {
        host: historyhost,
        port: historyport,
        path: historypath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
    };

    let reque = http.request(stateoptions, ress => {
        console.log(`statusCode: ${ ress.statusCode }`)

        ress.on('data', d => {
            process.stdout.write(d)
        })
    })

    reque.on('error', error => {
        console.error(error)
    })

    reque.write(data)
    reque.end()

    reque = http.request(historyoption, ress => {
        console.log(`statusCode: ${ress.statusCode}`)

        ress.on('data', d => {
            process.stdout.write(d)
        })
    })

    reque.on('error', error => {
        console.error(error)
    })

    reque.write(data)
    reque.end()

    res.sendStatus(200);
});

app.listen(3001, function () {
    console.log("Server waiting connection...");
});