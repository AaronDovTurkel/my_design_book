const express = require("express");
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Account} = require('./models');


router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/sign_up_form.html");
});

router.post('/', (req, res) => {
    const requiredFields = ['name', 'email', 'userName', 'passWord'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Account
      .create({
        name: req.body.name,
        email: req.body.email,
        accountType: req.body.accountType,
        userName: req.body.userName,
        passWord: req.body.passWord
      })
      .then(account => res.status(201).json(account.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });

module.exports = router;