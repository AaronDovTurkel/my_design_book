'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//schema


/*const profileSchema = mongoose.Schema({
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
});*/ // ->  Under Construction


const subProjectPictureSchema = mongoose.Schema({
  subProject: { type: mongoose.Schema.Types.ObjectId, ref: 'SubProject' },
  pictureTitle:  {type: String, required: true},
  pictureDate: {type: Date, default: Date.now},
  imgUrl: {type: String, required: true}
});

const measurementSchema = mongoose.Schema({
  title: {type: String, required: false},
  content:  {type: String, required: false}
});

const subProjectSchema = mongoose.Schema({
  project: { type: mongoose.Schema.Types.String, ref: 'Project' },
  subProjectTitle: {type: String, required: false},
  info: [{type: String, required: false}],
  pictures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubProjectPicture' }], 
  measurements: [measurementSchema],
});

const projectSchema = mongoose.Schema({ 
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
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
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});



//pre-hook


// virtual pop


//serialize
accountSchema.virtual('accountName').get(function() {
  return `${this.name.firstName} ${this.name.lastName}`.trim();
});


// export
const Account = mongoose.model('Account', accountSchema);

const Project = mongoose.model('Project', projectSchema);

const SubProject = mongoose.model('SubProject', subProjectSchema);

const SubProjectPicture = mongoose.model('SubProjectPicture', subProjectPictureSchema);


module.exports = { Account, Project, SubProject, SubProjectPicture};