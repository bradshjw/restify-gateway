var Router = require('restify-router').Router;
var router = new Router();

var User = require('./../models/user');

function getAllUser(req, res, next) {
  User.find({}, function (err, users) {
    res.json(users);
  });
}

function testAdd(req, res, next) {
  // create a sample user
  var newUser = new User({
    name: 'Mike Intern',
    password: 'password',
    admin: false
  });

  newUser.save(function (error) {
    if (error) throw error;

    console.log('User saved successfully');
    res.json({ success: true });
  });
}

router.get('/users', getAllUser);

module.exports = router;