const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

router.use(express.json());


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Profile, Project, SubProject, SubProjectPicture } = require('./models');

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

/*router.get("/projects", (req, res) => {
    Project
        .find()
        .populate('subProjects') 
        .exec(function (err, projects) {
            if (err) return handleError(err);

            res.status(200).json(projects);
        });
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: `something went terribly wrong ${err}` });
        });
    res.sendFile(__dirname + "/views/pages/client-pages/client-projects.html");
});*/

/*router.post('/projects', (req, res) => {
    const requiredFields = ['projectTitle', 'taggedAccount'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Project
        .create({
            projectTitle: req.body.projectTitle,
            taggedAccount: req.body.taggedAccount
        })
        .then(subProject => {
            SubProject
                .create({
                    taggedProject: subProject._id,
                    subProjectTitle: `Sub-Project One`
                })
                .then(subProjectPicture => {
                    SubProjectPicture
                        .create({
                            taggedSubProject:  subProjectPicture._id,
                            pictureTitle:  `Picture One`
                        });
                });
        })
        .then(project => res.status(200).json(project))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: `something went terribly wrong ${err}` });
        });
});*/

router.get("/explore", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-explore.html");
});

router.get("/unique_project", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});

/*router.get("/unique_project-sub_projects", (req, res) => { //TODO: will be replaced with /:id
    SubProject
        .find()
        .then(subProjects => res.status(200).json(subProjects))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: `something went terribly wrong ${err}` });
        });
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});*/

module.exports = router;