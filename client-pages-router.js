const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

router.use(express.json());


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Account, Profile, Project, SubProject, SubProjectPicture, Measurement } = require('./models');


// get section //

// get - find() -  all accounts
router.get("/explore", (req, res) => {
    Account.
        find().
        populate({
            path: 'projects',
            populate: {
                path: 'subProjects',
                populate: { path: 'pictures'}
            }
        }).
        then(accounts => {
            res.status(200).json(accounts);
            console.log(`${accounts}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find account by id
router.get("/:id", (req, res) => {
    Account.
        findById(req.params.id).
        populate({
            path: 'projects',
            populate: {
                path: 'subProjects',
                populate: { path: 'pictures'}
            }
        }).
        then(accounts => {
            res.status(200).json(accounts);
            console.log(`${accounts}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> projects
router.get("/:id/projects", (req, res) => {
    Project.
        findById(req.params.id).
        populate({
            path: 'subProjects',
            populate: {
                path: 'pictures'
            }
        }).
        then(projects => {
            res.status(200).json(projects);
            console.log(`${projects}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> project's -> subProjects
router.get("/:id/subProjects", (req, res) => {
    SubProject.
        findById(req.params.id).
        populate('pictures').
        then(subProjects => {
            res.status(200).json(subProjects);
            console.log(`${subProjects}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// get - findById() - find unique client's -> project's -> subProjects -> unique picture
router.get("/:id/subProjectPicture", (req, res) => {
    SubProjectPicture.
        findById(req.params.id).
        populate('pictures').
        then(subProjectPicture => {
            res.status(200).json(subProjectPicture);
            console.log(`${subProjectPicture}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// 6 posts
// post - findById() - post to unique client -> new project
router.post("/:id/project", (req, res) => {
    const requiredFields = ['projectTitle'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Project.
        create({
            projectTitle: req.body.projectTitle,
            account: req.params.id
        }).
        then(project => {
            SubProject.
                create({
                    subProjectTitle: `Empty subProject One`,
                    project: project._id
                }).
                then(subProject => {
                    SubProjectPicture.
                        create({
                            pictureTitle: `Empty Picture One`,
                            subProject: subProject._id,
                            imgUrl: 'fakeUrl.furl'
                        }).
                        then (subProjectPicture => {
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
                            Account.
                                findById(req.params.id).
                                then(updatedUser => {
                                    updatedUser.projects.push(project);
                                    updatedUser.save(function(err){
                                        if(err) return console.log(err.stack);
                                        console.log("user updated with a fully populated new project");
                                    });
                                });
                            res.status(201).json(project);
                            console.log(`${project}`);
                        });
                });
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - create - post to unique client -> unique project -> new subProject
router.post("/:id/subProject", (req, res) => {
    const requiredFields = ['subProjectTitle'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProject.
        create({
            subProjectTitle: req.body.subProjectTitle,
            project: req.params.id
        }).
        then(subProject => {
            SubProjectPicture.
                create({
                    pictureTitle: `Empty Picture One`,
                    subProject: subProject._id,
                    imgUrl: 'fakeUrl.furl'
                }).
                then (subProjectPicture => {
                    subProject.pictures.push(subProjectPicture);
                    subProject.info.push('Empty info message...');
                    subProject.measurements.push({
                        title: "Empty Measurement Title",
                        content: 'Empty measurement message...'
                    });
                    subProject.save(function(err){
                        if(err) return console.log(err.stack);
                    });
                    Project.
                        findById(req.params.id).
                        then(updatedProject => {
                            updatedProject.subProjects.push(subProject);
                            updatedProject.save(function(err){
                                if(err) return console.log(err.stack);
                                console.log("project updated with a fully populated new subProject");
                            });
                        });
                    res.status(201).json(subProject);
                    console.log(`${subProject}`);
                });
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

// post - create - post to unique client -> unique project -> unique subProject -> new picture
router.post("/:id/subProjectPicture", (req, res) => {
    const requiredFields = ['pictureTitle', 'imgUrl'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    SubProjectPicture.
        create({
            pictureTitle: req.body.pictureTitle,
            subProject: req.params.id,
            imgUrl: req.body.imgUrl
        }).
        then (subProjectPicture => {
            SubProject.
                findById(req.params.id).
                then(updatedSubProject => {
                    updatedSubProject.pictures.push(subProjectPicture);
                    updatedSubProject.save(function(err){
                        if(err) return console.log(err.stack);
                    });
                })
            
            res.status(201).json(subProjectPicture);
            console.log(`${subProjectPicture}`);
        }).
        catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went horribly awry' });
        });
});

router.post("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.post("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.post("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

// 6 puts
router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.put("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

// 6 deletes
router.delete("/explore", (req, res) => {
    Account
        .deleteMany();
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.delete("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.delete("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.delete("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.delete("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});

router.delete("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
});



/*router.get("/projects", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-projects.html");
});

router.post('/projects', (req, res) => {
    const requiredFields = ['projectTitle', 'taggedAccount'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
});

router.get("/explore", (req, res) => {
    Account
        .find()
        .then(accounts => res.status(200).json(accounts))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: `something went terribly wrong ${err}` });
        });
    res.sendFile(__dirname + "/views/pages/designer-pages/designer-explore.html");
});

router.get("/unique_project", (req, res) => { //TODO: will be replaced with /:id
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});

router.get("/unique_project-sub_projects", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-unique_project-pages/client-unique_project-sub_projects.html");
});*/

module.exports = router;