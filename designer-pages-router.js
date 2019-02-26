const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Profile, Project, SubProject, SubProjectPicture } = require('./models');

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-home.html");
});

router.get("/clients", (req, res) => {
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-clients.html");
});

router.get("/explore", (req, res) => {
    Account
        .find()
        .then(accounts => {
            res.json(accounts.map(account => {
                return {
                id: account._id,
                name: `${account.firstName} ${account.lastName}`,
                userName: account.userName
                };
            }));
        })
        .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
        });
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-explore.html");
});

router.get("/unique_client", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-unique_client-pages/designer-unique_client-projects.html");
});

router.get("/unique_client-projects", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-unique_client-pages/designer-unique_client-projects.html");
});


module.exports = router;