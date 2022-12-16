const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('node:path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const website = express.Router();
website.use(express.static(path.join(__dirname, 'public')));

const usersCredentials = {};

website.get('/token', (req, res) => {
    if(!('code' in req.query)){
        res.status(400).end;
    }
    const code = req.query.code;
    axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.ID}&client_secret=${process.env.SECRET}&code=${code}&grant_type=authorization_code`)
        .then(result => {
            if(result.status === 200 && 'athlete' in result.data){
                usersCredentials[result.data.athlete.id] = {
                    "refresh_token": result.data.refresh_token,
                }
                res.status(200).json({
                    "token": result.data.access_token,
                    "expires": result.data.expires_at,
                })
            } else {
                res.status(500).end();
            }
        })
        .catch(e => {
            console.log(e);
            res.status(500).end();
        })
})

website.get('/refresh', (req, res) => {
    if(!('userId' in req.query)){
        res.status(400).end();
    }
    const userId = req.query.userId;
    if(usersCredentials[userId] === undefined){
        res.status(401).end();
    }
    axios.post(`https://www.strava.com/oauth/token?client_id=${process.env.ID}&client_secret=${process.env.SECRET}&refresh_token=${usersCredentials[userId].refresh_token}&grant_type=refresh_token`)
        .then(result => {
            if(result.status === 200){
                usersCredentials[result.data.athlete.id] = {
                    "refresh_token": result.data.refresh_token,
                }
                res.status(200).json({
                    "token": result.data.access_token,
                    "expires": result.data.expires_at,
                })
            }
        })
        .catch(e => {
            console.log(e);
            res.status(500).end();
        })
})

app.use('', website);
const server = http.createServer(app);
server.listen(process.env.npm_config_port);

console.log(process.env.npm_config_port);

server.on('listening', () => console.log(`Listening on port ${server.address().port}`))