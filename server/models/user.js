let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');
let settings = require('../settings');


module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true},
      set: function (val) {
        if (!val) {
          val = '';
        }
        this.setDataValue('email', val.toLowerCase());
      }
    },
    name: {
      type: DataTypes.STRING(1024), allowNull: false, validate: {notEmpty: true}
    },
    passwordDigest: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } }
  },{
      classMethods: {
        /**
           * Rejected with null if invalid claims or user not found.
           */
        fromJWTClaims: function (claim) {
          if (claims.user && claims.user.id) {
            return User.findOne({ where: { id: claims.user.id } });
          } else {
            return new Promise(function (resolve, reject) {
              reject(null);
            });
          }

        }
      },
      instanceMethods: {
        generatePasswordHash: function (password) {
          return bcrypt.genSalt(settings.variables.saltRounds).then((salt) => {
            return bcrypt.hash(password, salt).then((hash) => {
              this.set('passwordDigest', hash);
              return this;
            });
          });
        },
        validatePassword: function (password) {
          return bcrypt.compare(password, this.passwordDigest);
        },
        /**
         * Generates a jwt uniquely identifying this user.
         * exp - validity time in seconds, undefined if no expiry.
         */
        generateJWT: function (exp) {
          let claims = {
            user: {
              email: this.email,
              name: this.name,
              createdAt: this.createdAt,
              id: this.id
            }
          };
          if (exp) {
            // Seconds since epoch to expire at
            claims.exp = Math.floor(Date.now() / 1000) + exp;
          }
          // Hash password to hide salt values.
          let identHash = crypto.createHash('sha512');
          identHash.update(this.email);
          identHash.update(this.passwordDigest);
          claims.ident_digest = identHash.digest('hex');
          return new Promise(function (resolve, reject) {
            jwt.sign(claims, settings.variables.jwtSecret, {
              algorithm: 'HS512'
            }, function (err, token) {
              if (err) {
                reject(err);
              } else {
                resolve(token);
              }
            })
          });
        }
      },
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['email'],
          name: 'email_unique_index'
        }
      ]
    });

  return User;
}