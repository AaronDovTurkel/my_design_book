const express = require("express");
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Profile, Project, SubProject, SubProjectPicture, Comment, Measurement } = require('./models');


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

  let newComment = new Comment({
    commentAuthor: `Comment Example Author`,
    content: `Comment content example...`
  });

  newComment.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newComment is added")
  });

  let newSubProjectPicture = new SubProjectPicture({
    pictureTitle: `SubProject Picture One`
  });

  newSubProjectPicture.pictureComments.push(newComment);

  newSubProjectPicture.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newSubProject is added")
  });

  let newMeasurement = new Measurement({
    title: `Measurement Example Title`,
    content: `Measerment content example...`
  });

  newMeasurement.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newMeasurement is added")
  });

  let newSubProject = new SubProject({
    subProjectTitle: `SubProject One`
  });

  newSubProject.info.push(`Example info for subProject One...`);
  newSubProject.measurements.push(newMeasurement);
  newSubProject.pictures.push(newSubProjectPicture);

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

  let newProfile = new Profile({
    gender: '',
    dob: '',
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: ''
    },
    designStyle: '',
    profileImage: '',
    personalInfo: ''
  });

  newProfile.save(function (err){
    if(err) return console.error(err.stack)
    console.log("newProfile is added")
  });

  let newAccount = new Account({
    name: req.body.name,
    email: req.body.email,
    accountType: req.body.accountType,
    userName: req.body.userName,
    passWord: req.body.passWord
  });

  newAccount.profile.push(newProfile);
  newAccount.projects.push(newProject);

  
  newAccount.save(function(err){
	  if(err) return console.log(err.stack);
	  console.log("newAccount is added")
  });

  res.status(200).json(newAccount);
 
});

module.exports = router;