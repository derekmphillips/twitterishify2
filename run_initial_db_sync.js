const models = require('./server/models');
const sequelize = models.sequelize;

console.info('[DB]', 'Running initial migrations');

sequelize.sync().then(function() {
  console.info("[DB]", "Ran migrations successfully");
  process.exit(0);
}).catch(function(err) {
  console.error("[DB]", "Error while running initial migration", err);
  process.exit(-1);
});