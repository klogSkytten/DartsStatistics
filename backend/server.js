//REQUIREMENTS
const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const configuration = require('./configuration');
const language = require('./language');
const db = require('./database');

// DECLARATION OF CONSTANTS AND INSTANCES
let config = Object();
config.file = path.join(__dirname, '/../userdata/config.yaml');
config.fileDflt = path.join(__dirname, '/../config.yaml');
config.langFile = path.join(__dirname, '/../language.yaml');
const htmlPath = path.join(__dirname, '/../frontend');
const port = 9000;
const app = express();
const server = http.createServer(app);
const communication = socket(server);

// START SERVER
server.listen(port, function(){
    console.log('Server started.');

    // CONNECT TO DATABASE
    db.connection.connect(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Connection to MySQL established!");

            // INITIALIZE DATABASES IF NECCESSARY
            console.log("Checking Databases.");
            db.connection.query('CREATE DATABASE IF NOT EXISTS DS_games', function (err) {
                if (err) console.log(err);
            });
            db.connection.query('CREATE DATABASE IF NOT EXISTS DS_players', function (err) {
                if (err) console.log(err);
            });
            db.connection.query('CREATE DATABASE IF NOT EXISTS DS_settings', function (err) {
                if (err) console.log(err);
            });
        }
    });

    // SHOW HTML PAGE
    app.use(express.static(htmlPath));
})

// COMMUNICATION FUNTIONS
communication.on('connection', (conn) => {
    // CONNECTION CONFIRMATION
    console.log('New Connection: %s', conn.id);
    conn.emit('CONNECT', conn.id);

    // CONFIGURATION SET
    config.set = configuration.getConfig(config);
    config.set.lang = language.getPhrases (config.langFile, config.set.command, config.set.data.general.lang);
    conn.emit('CONFIG', config.set);

    // DISCONNECTION CONFIRMATION
    conn.on('disconnect', () => {
        console.log('Connection closed: %s', conn.id);
    });

    // RECEIVE CONFIGURATION SET
    conn.on('CONFIG', data => {
        // SAVE CONFIGURATION SET
        config.set.newProps = data;
        configuration.saveConfig(config.file, config.set);
    });

    // LANGUAGE REQUEST
    conn.on('LANG', data => {
        // GET LANGUAGE PHRASES AND RESPONSE IT
        let langResp = config.set.lang = language.getPhrases (config.langFile, data[0], data[1]);
        conn.emit('LANG', [data[0], langResp]);
    })
})