/*
* Simple LIFO queue for redirections.
* Author: Ahmed H. Ismail
*/
angular.module('twitter').factory('redirect', function() {
    var Redirect = function(history) {
        this.history = history ? history: [];
    };
    Redirect.prototype.push = function(item) {
        return this.history.push(item);
    };
    Redirect.prototype.pop = function() {
        return this.history.pop();
    };
    Object.defineProperty(Redirect.prototype, 'empty', {
        get: function() {
            return this.history.length === 0;
        }
    });
    return new Redirect();
});