const express = require("express");
const router = express.Router();
const { User } = require("../classes/user");
const bodyParser = require("body-parser");

router.post("/", bodyParser.json(), async (req, res) => {
  let response = await User.login(req, res);
  return response;
});

module.exports = router;
