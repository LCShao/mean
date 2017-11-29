var express = require('express');
var router = express.Router();
var users=require("../controllers/users.controller");

///users下
router.route("/signup")
  .get(users.renderSignup)
  .post(users.signup);
router.route("/signin")
  .get(users.renderSignin)
  .post(users.signin);
router.route("/signout").get(users.signout);

module.exports = router;
