const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Project, SubProject, SubProjectPicture } = require('./models');


router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/sign_up_form.html");
});

router.post('/', (req, res) => {
  const requiredFields = ['email', 'userName', 'passWord'];
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
      userName: req.body.userName,
      passWord: req.body.passWord
    })
    .then(user => {
      Project
        .create({
          projectTitle: `Empty Project One`,
          account: user._id
        })
        .then(project => {
          SubProject
            .create({
              subProjectTitle: `Empty subProject One`,
              project: project._id
            })
            .then(subProject => {
              SubProjectPicture
                .create({
                  pictureTitle: `Empty Picture One`,
                  subProject: subProject._id,
                  imgUrl: 'fakeUrl.furl'
                })
                .then (subProjectPicture => {
                  subProject.pictures.push(subProjectPicture);
                  subProject.info.push('Empty info message...');
                  subProject.measurements.push({
                    title: "Empty Measurement Title",
                    content: 'Empty measurement message...'
                  });
                  subProject.save(function(err){
                    if(err) return console.log(err.stack);
                  });
                  project.subProjects.push(subProject);
                  project.save(function(err){
                    if(err) return console.log(err.stack);
                  });
                  user.projects.push(project);
                  user.save(function(err){
                    if(err) return console.log(err.stack);
                    console.log("new user added with a fully populated project");
                  });
                })
                .then(() => res.status(201).json(user));
            });
        });
    }).
    catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

module.exports = router;