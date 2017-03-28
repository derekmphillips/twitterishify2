let router = require('express').Router();
let { sequelize: { models: { User } } } = require('../models');

// Create a token with credentials
router.post('/', function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let exp = req.body.expiration;
  let errors = {};
  if (typeof email !== 'string') {
    errors['email'] = 'Must be a string';
  }
  if (typeof password !== 'string') {
    errors['password'] = 'Must be a string';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  return User.findOne({ where: { email: email.toLowerCase() } }).then(function (user) {
    if (user === null) {
      return res.status(403).json({
        message: 'Invalid credentials'
      });
    }
    return user.validatePassword(password).then(function (valid) {
      if (valid) {
        return user.generateJWT(exp).then(function(jwt) {
          return res.status(201).json({
            profile: user.get(),
            token: jwt
          });
        }).catch(function(err) {
          return next(err);
        });
      } else {
        return res.status(403).json({
          message: 'Invalid credentials'
        });
      }
    }).catch(function(err) {
      return next(err);
    })
  })
});

module.exports = router;