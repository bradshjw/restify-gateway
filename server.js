var Router = require('restify-router').Router;
var routerInstance = new Router();
var userRouter = require('./app/handlers/user');
var securityRouter = require('./app/handlers/security');
var restify = require('restify');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

var port = process.env.port || 8080;
var db = mongoose.connect(config.database);

// set a basic route for testing
routerInstance.get('/', function (req, res) {
  res.send('Hello, the API is at http://localhost:' + port + '/api');
});

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
routerInstance.applyRoutes(server, '/api');
userRouter.applyRoutes(server, '/api');
securityRouter.applyRoutes(server, '/api');

// route middleware to verify token
function intercept(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;

        next();
      }
    });
  } else {
    // no token, return
    return res.send(403, {
      success: false,
      message: 'No token provided'
    });
  }
}

routerInstance.use(intercept);
userRouter.use(intercept);

// use morgan to log requests
server.use(morgan('dev'));

server.listen(port, function () {
  console.log('Magic happens at http://localhost:' + port);
});
