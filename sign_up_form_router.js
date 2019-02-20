const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/pages/sign_up_form.html");
});

module.exports = router;