let http = require('http');
let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('express-jwt');
let settings = require('./settings');
var unless = require('express-unless');


let app = express();
app.set("trust proxy", true);
app.disable('x-powered-by');
let server = http.createServer(app);
// socketio friendly, for future integration if needed.
app.use(bodyParser.json());
app.use(jwt({
  secret: settings.variables.jwtSecret,
  credentialsRequired: true,
  userProperty: 'decoded_token',
  getToken: function (req) {
    if (req.headers.authorization) {
      return req.headers.authorization.replace("Bearer ", '');
    } else if (req.query && req.query.jwt_token) {
      return req.query.token;
    } else {
      return null;
    }
  }
}).unless({
  path: [
    {url: /tokens/, methods: ['POST']},
    {url: /users/, methods: ['POST']},
    {url: /exists/, methods: ['GET']}
  ]
}));

let { usersRouter, tweetsRouter, tagsRouter, tokensRouter } = require('./routers');
app.use('/api/tweets', tweetsRouter);

app.use('/api/users', usersRouter);

app.use('/api/tags', tagsRouter);
app.use('/api/tokens', tokensRouter);


app.use(function (err, req, res, next) {
  // JWT error handling
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      message: 'Invalid token'
    });
  } else {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  // Generic error handling
  // Always log error
  console.error('[API]', 'generic error handler', err);
  if (settings.variables.isProduction) {
    // Silent 500
    res.status(500).json({
      message: 'Internal Server Error'
    });
  } else {
    // 500 with stack traces.
    res.status(500).json({
      messge: "Internal Server Error",
      error: err.stack || err
    });
  }
});




module.exports = server;