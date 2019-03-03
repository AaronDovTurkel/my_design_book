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
router.post("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/client-pages/client-home.html");
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