let Twitter = require('twitter');
let settings = require('../settings');

let twitterClient = new Twitter({
  consumer_key: settings.variables.CONSUMER_KEY,
  consumer_secret: settings.variables.CONSUMER_SECRET,
  bearer_token: settings.variables.BEARER_TOKEN
});


module.exports = function (sequelize, DataTypes) {
  let Tweet = sequelize.define("Tweet", {
    text: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    lat: { type: DataTypes.TEXT, allowNull: true, validate: { notEmpty: true } },
    long: { type: DataTypes.TEXT, allowNull: true, validate: { notEmpty: true } },
    tweetedAt: { type: DataTypes.DATE, allowNull: false },
    tweetIdStr: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    tweetOwnerIdStr: { type: DataTypes.STRING(1024), allowNull: false, validate: {  notEmpty: true } },
    tweetOwnerScreenName: { type: DataTypes.STRING(1024), allowNull: false, validate: { notEmpty: true } },
    retweetCount: { type: DataTypes.INTEGER, allowNull: false },
    inReplyToTweetIdStr: { type: DataTypes.TEXT, allowNull: true },
    inReplyToUserIdStr: { type: DataTypes.TEXT, allowNull: true },
    twitterParsedEntitiesJSON: { type: DataTypes.TEXT, allowNull: true }
  }, {
      classMethods: {
        associate: function (models) {
          Tweet.belongsToMany(models.Tag, {
            through: 'TweetTags',
          });
        },
        fetchSingleTweetByID: function (id) {
          // Remote fetch
          return twitterClient.get(`statuses/show/${id}`, {});
        },
        fromRemote: function(tweetData) {
          // console.log(tweetData);
          let tweet = Tweet.build({
            text: tweetData.text,
            tweetedAt: tweetData.created_at,
            tweetIdStr: tweetData.id_str,
            tweetOwnerIdStr: tweetData.user.id_str,
            tweetOwnerScreenName: tweetData.user.screen_name,
            retweetCount: tweetData.retweet_count,
            inReplyToTweetIdStr: tweetData.in_reply_to_status_id_str,
            inReplyToUserIdStr: tweetData.in_reply_to_user_id_str,
            twitterParsedEntitiesJSON: JSON.stringify(tweetData.entities)

          });
          return tweet.save();
        }
      },
      indexes: [
        {
          fields: ['tweetOwnerIdStr'],
          name: 'tweetOwnerIdStr_index'
        }, {
          fields: ['tweetOwnerScreenName'],
          name: 'tweetOwnerScreenName_index'
        }
      ]
    });
  return Tweet;
}