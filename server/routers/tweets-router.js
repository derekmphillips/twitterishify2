let router = require('express').Router();
let { sequelize: { models: { Tweet, Tag } } } = require('../models');
let Twitter = require('twitter');
let settings = require('../settings');

let twitterClient = new Twitter({
  consumer_key: settings.variables.CONSUMER_KEY,
  consumer_secret: settings.variables.CONSUMER_SECRET,
  bearer_token: settings.variables.BEARER_TOKEN
});


router.get('/screen/:screenName', function (req, res, next) {
  let since = req.query.since;
  let count = req.query.count;
  let max_id = req.query.max_id;
  let screenName = req.params.screenName;
  let params = {
    screen_name: screenName
  };
  if(since) {
    params.since = since;
  }
  if(count) {
    params.count = count;
  }
  if(max_id) {
    params.max_id = max_id;
  }
  let path = 'statuses/user_timeline';
  return twitterClient.get(path, params).then(function(results) {
    return res.status(200).json(results);
  }).catch(function(err) {
    return res.status(400).json(err);
  })
});

router.get('/tagged', function (req, res, next) {
  let pageSize = 10;
  let page = req.query.page || '1';
  return Tweet.findAndCountAll({
    include: [{ model: Tag }],
    offset: pageSize * Math.max((page - 1), 0),
    limit: pageSize,
    order: 'createdAt ASC'
  }).then(function ({ rows, count }) {
    return res.status(200).json({
      rows: rows,
      count: count,
      page_size: pageSize,
      total_pages: Math.ceil(count / pageSize)
    });
  }).catch(function (err) {
    next(err);
  });
});

router.get('/tagged/:tag', function (req, res, next) {
  let pageSize = 10;
  let page = req.query.page || '1';
  return Tweet.findAndCountAll({
    include: [{ model: Tag, where: { text: req.params.tag } }],
    offset: pageSize * Math.max((page - 1), 0),
    limit: pageSize,
    order: 'createdAt ASC'
  }).then(function ({ rows, count }) {
    return res.status(200).json({
      rows: rows,
      count: count,
      page_size: pageSize,
      total_pages: Math.ceil(count / pageSize)
    });
  }).catch(function (err) {
    next(err);
  });
});



router.post('/tag/:tweetId', function (req, res, next) {
  let tweetId = req.params.tweetId;
  let tag = req.body.text;
  if(typeof tag !== 'string' || tag.length === 0) {
      return res.status(400).json({
        text: 'Must be a non empty string'
      });
  }
  let addTag = function(tweet) {
    Tag.findOrCreate({
      where: {
        text: tag
      }
    }).then(function(tag) {
      tag.addTweet(tweet);
      return tag.save().then(function() {
        return res.status(200).json(tag.get());
      });
    }).catch(function(err) {
      return next(err);
    });
  }
  return Tweet.findOne({
    where: {
      tweetIdStr: tweetId
    }
  }).then(function (tweet) {
    if (tweet === null) {
      return Tweet.fetchSingleTweetByID(tweetId).then(function (tweet) {
        return Tweet.fromRemote(tweet).then(function (tweet) {
          return addTag(tweet)
        });
      });
    } else {
      return addTag(tweet);
    }
  })
});

router.get('/tweet/:tweetId', function (req, res, next) {
  let tweetId = req.params.tweetId;
  return Tweet.findOne({
    where: {
      tweetIdStr: tweetId
    }
  }).then(function (tweet) {
    if (tweet === null) {
      return Tweet.fetchSingleTweetByID(tweetId).then(function (tweet) {
        return Tweet.fromRemote(tweet).then(function (tweet) {
          return res.status(200).json(tweet);
        });
      }).catch(function (err) {
        return res.status(404).json({
          message: 'Not Found'
        });
      });
    } else {
      return res.status(200).json(tweet);
    }
  }).catch(function (err) {
    return next(err);
  })
});


module.exports = router;