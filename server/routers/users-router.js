let router = require('express').Router();
let { sequelize: { models: { User } } } = require('../models');
let lodash = require('lodash');

router.get('/', function (req, res, next) {
  let pageSize = 10;
  let page = req.query.page || '1';


  return User.findAndCountAll({
    offset: pageSize * Math.max((page-1), 0),
    limit: pageSize,
    order: 'name ASC'
  }).then(function({rows, count}){
    return res.status(200).json({
      rows: rows,
      count: count,
      page_size: pageSize,
      total_pages: Math.ceil(count / pageSize)
    });
  }).catch(function(err) {
    return next(err);
  });
});

router.get('/email/exists', function(req, res, next) {
  let email = req.query.value;
  User.count({
    where: {
      email: email.toLowerCase()
    }
  }).then(function(count) {
    return res.status(200).json({count: count});
  }).catch(function(err) {
    return next(err);
  });
});

router.post('/', function (req, res, next) {
  let params = Object.assign({}, req.body);
  let password = params.password;
  params.password = undefined;
  let user = User.build(params);
  if (password) {
    return user.generatePasswordHash(password).then(function (user) {
      return user.validate().then(function (state) {
        if (state === null) {
          return user.save().then(function () {
            return res.status(201).json(user.get());
          });
        } else {
          let data = lodash.map(state.errors, lodash.partialRight(lodash.pick, ['path', 'message']));
          return res.status(400).json(data);
        }
      })
    }).catch(function (err) {
      return next(err);
    });
  } else {
    return res.status(400).json({
      message: 'Invalid params',
      fields: {
        password: 'required'
      }
    });
  }
});

router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  if (id === null || id === undefined) {
    return res.status(400).json({
      message: 'Missing fields',
      fields: {
        'id': 'required'
      }
    });
  }

  return User.findOne({ where: { id: id } }).then(function (user) {
    if (user === null) {
      return res.status(403).json({
        message: 'Invalid credentials'
      });
    }
    return res.status(200).json(user.get());
  }).catch(function (err) {
    return next(err)
  });

});

router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  if (id === null || id === undefined) {
    return res.status(400).json({
      message: 'Missing fields',
      fields: {
        'id': 'required'
      }
    });
  }

  return User.fromJWTClaims(req.decoded_token).then(function (user) {
    if (user === null) {
      return res.status(404).json({
        message: 'User not found'
      });
    } else if (user.id !== id) {
      return res.status(403).json({
        message: 'Unrelated to user'
      });
    } else {
      const forbiddenAttrs = ['passwordDigest', 'id', 'createdAt', 'email', 'updatedAt'];
      let newPassword = null;
      for (key in req.body) {

        if (!req.body.hasOwnProperty(key)) {
          continue;
        }
        if (key === 'password') {
          newPassword = req.body[key];
        } else if (key in Object.keys(User.attributes) && !(key in forbiddenAttrs)) {
          user.set(key, req.body[key]);
        }
      }

      let validateAndSave = function (user) {
        return user.validate(function (state) {
          if (state === null) {
            return user.save();
          } else {
            let data = lodash.map(state.errors, lodash.partialRight(lodash.pick, ['path', 'message']));
            res.status(400).json(data);
            throw null;
          }
        });
      };
      if (newPassword !== null) {
        return user.generatePasswordHash(newPassword).then(function (user) {
          return validateAndSave(user).then(function () {
            return res.status(200).json(user.get());
          }).catch(function (err) {
            if (err === null) {
              return
            }
            return next(err);
          });
        });
      } else {
        return validateAndSave(user).then(function () {
          return res.status(200).json(user.get());
        }).catch(function (err) {
          if (err === null) {
            return
          }
          return next(err);
        });
      }

    }
  }).catch(function(err) {
    if(err === null) {
      return res.status(401).json({
        message: 'Invalid Token'
      });
    } else {
      next(err);
    }
  })

});

module.exports = router;