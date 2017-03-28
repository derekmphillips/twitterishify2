angular.module('twitter').factory('User', function (moment, UsersResource, endpoints) {

  var User = function (resource) {
    this.resource = resource;
  };

  User.fromJSON = function (data) {
    return new User(new UsersResource(data));
  };


  User.$get = function (id) {
    return UsersResource.get({ id: id }).$promise.then(function (resource) {
      return new User(resource);
    });
  };

  User.prototype.$update = function () {
    var _this = this;
    return this.resource.$update().then(function () {
      return _this;
    });
  };

  Object.defineProperty(User.prototype, 'id', {
    get: function () {
      return this.resource.id;
    }
  });

  Object.defineProperty(User.prototype, 'password', {
    get: function () {
      return this.resource.user.password;
    },
    set: function (value) {
      return this.resource.user.password = value;
    }
  });

  Object.defineProperty(User.prototype, 'name', {
    get: function () {
      return this.resource.name;
    },
    set: function (value) {
      return this.resource.name = value;
    }
  });

  Object.defineProperty(User.prototype, 'email', {
    get: function () {
      return this.resource.user.email;
    }
  });

  Object.defineProperty(User.prototype, 'created_at_pretty', {
    get: function () {
      return moment(this.resource.createdAt).format("MMMM Do YYYY");
    }
  });

  Object.defineProperty(User.prototype, 'defaultStateName', {
    get: function () {
      return 'base.private.tweets';
    }
  });

  Object.defineProperty(User.prototype, 'created_at', {
    get: function () {
      return this.createdAt;
    }
  });


  return User;
});