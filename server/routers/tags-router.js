let router = require('express').Router();
let { sequelize: { models: { Tag } } } = require('../models');


router.get('/', function (req, res, next) {
  let pageSize = rq.query.page_size || '10';
  let page = req.query.page || '1';
  return Tag.findAndCountAll({
    offset: pageSize * Math.max((page - 1), 0),
    limit: pageSize,
    order: 'text ASC'
  }).then(function ({ rows, count }) {
    return res.status(200).json({
      rows: rows,
      count: count,
      page_size: pageSize,
      total_pages: Math.ceil(count / pageSize)
    });
  }).catch(function (err) {
    return next(err);
  });
});

router.get('/:text', function (req, res, next) {
  let text = req.params.text.toLowerCase();
  return Tag.findOne({
    where: {
      text: text
    }
  }).then(function (tag) {
    if (tag === null) {
      return res.status(404).json({
        message: 'Not Found'
      });
    } else {
      return res.status(200).json(tag.get());
    }
  }).catch(function (err) {
    return next(err);
  });
});

module.exports = router;