const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Profile, Project, SubProject, SubProjectPicture, Measurement } = require('./models');


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
                  project.subProjects.push(subProject);
                  project.save(function(err){
                    if(err) return console.log(err.stack);
                  user.projects.push(project);
                  user.save(function(err){
                    if(err) return console.log(err.stack);
                    console.log("new user added with a populated project");
                  });
                });
              });
            });
          });
        });
      res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });



  //create and save new subProjectPicture
  /*let newSubProjectPicture = new SubProjectPicture({
    pictureTitle: `SubProject Picture One`,
    imgUrl: 'Example imgUrl'
  });

  newSubProjectPicture.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newSubProject is added")
  });

  //create and save new measurement
  let newMeasurement = new Measurement({
    title: `Measurement Example Title`,
    content: `Measurement content example...`
  });

  newMeasurement.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newMeasurement is added")
  });

  //create, save, and push new subProject (w/ info, measurement, and pic)
  let newSubProject = new SubProject({
    subProjectTitle: `SubProject One`
  });

  newSubProject.info.push(`Example info for subProject One...`);
  newSubProject.measurements.push(newMeasurement);
  newSubProject.pictures.push(newSubProjectPicture);

  //create and save new Project (w/ pushed subProject)
  newSubProject.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newSubProject is added")
  });

  let newProject = new Project({
    projectTitle: `Project One`
  });

  newProject.subProjects.push(newSubProject);

  newProject.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newProject is added")
  });

  //create and save new profile
  let newProfile = new Profile({
    gender: '',
    dob: 0,
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: ''
    },
    profileImage: '',
    personalInfo: ''
  });

  newProfile.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newProfile is added")
  });

  //create and save new Account (w/ all previous pushed info)
  let newAccount = new Account({
    name: req.body.name,
    email: req.body.email,
    userName: req.body.userName,
    passWord: req.body.passWord
  });

  newAccount.profile.push(newProfile);
  newAccount.projects.push(newProject);

  
  newAccount.save(function(err){
	  if(err) return console.log(err.stack);
	  console.log("newAccount is added")
  });*/
 
});

module.exports = router;