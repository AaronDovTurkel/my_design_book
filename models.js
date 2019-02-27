'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//schema
const profileSchema = mongoose.Schema({
  gender: {type: String, required: false},
  dob: {type: Date, required: false},
  address: {
    streetAddress: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false},
    zipCode: {type: String, required: false}
  },
  profileImage: {type: String, required: false},
  personalInfo: {type: String, required: false}
});


const subProjectPictureSchema = mongoose.Schema({
  pictureTitle:  {type: String, required: true},
  pictureDate: {type: Date, default: Date.now},
  imgUrl: {type: String, required: true}
});

const measurementSchema = mongoose.Schema({
  title: {type: String, required: false},
  content:  {type: String, required: false}
});

const subProjectSchema = mongoose.Schema({
  subProjectTitle: {type: String, required: false},
  info: [{type: String, required: false}],
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProjectPicture' }], 
  measurements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }],
});

const projectSchema = mongoose.Schema({ 
  projectTitle: {type: String, required: true},
  projectDate: {type: Date, default: Date.now},
  subProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' }] 
});

const accountSchema = mongoose.Schema({ 
  name: {
    firstName: {type: String, required: false},
    lastName: {type: String, required: false}
  },
  email: {type: String, required: true},
  userName: {type: String, required: true},
  passWord: {type: String, required: true},
  profile: [profileSchema], 
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] 
});


//pre-hook


// virtual
accountSchema.virtual('accountName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});

profileSchema.virtual('profileAddressFull').get(function() {
  return `${this.address.streetAddress}, ${this.address.city}, ${this.address.state}, ${this.address.zipCode}`.trim();
});

profileSchema.virtual('profileLocationState').get(function() {
  return `${this.address.state}`.trim();
});

//serialize
/*accountSchema.methods.serialize = function() {
  return {}*/


// export
const Account = mongoose.model('Account', accountSchema);

const Profile = mongoose.model('Profile', profileSchema);

const Project = mongoose.model('Project', projectSchema);

const SubProject = mongoose.model('SubProject', subProjectSchema);

const SubProjectPicture = mongoose.model('SubProjectPicture', subProjectPictureSchema);

const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = { Account, Profile, Project, SubProject, SubProjectPicture, Measurement };