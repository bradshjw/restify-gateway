var Router = require('restify-router').Router;
var router = new Router();
var User = require('./../models/user');
var jwt = require('jsonwebtoken');
var config = require('./../../config');

function authenticateRequest(req, res, next) {
  console.log("Attempting to authenticate user.");
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check password match
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Incorrect password.' });
      } else {

        // if user found and password correct
        // create token
        var webToken = jwt.sign(user, config.secret, {
          expiresIn: (60 * 60 * 24)
        });

        res.json({
          success: true,
          message: 'Authentication succesful',
          token: webToken
        });
      }
    }
  });
}

router.post('/authenticate', authenticateRequest);

module.exports = router;