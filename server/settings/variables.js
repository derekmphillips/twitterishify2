

let saltRoundsEnv = process.env.TWITTERISHIFY_SALT_ROUND || '12';
exports.saltRounds = parseInt(saltRoundsEnv, 10);

exports.SERVER_PORT = process.env.TWITTERISHIFY_SERVER_PORT || '3000';
exports.jwtSecret = process.env.TWITTERISHIFY_JWT_SECRET || 'secret';
exports.isProduction = process.env.NODE_ENV === 'production';

exports.CONSUMER_KEY = process.env.TWITTERISHIFY_CONSUMER_KEY || 'sN5Vw6u0uYCG1jCzvbwunXyV1';
exports.CONSUMER_SECRET = process.env.TWITTERISHIFY_CONSUMER_SECRET || 'HUXwBtrZ7NeCHbkCQMGUwljPBJH1WHNPNKYs7dUgibtvHqcydY';

exports.BEARER_TOKEN = process.env.TWITTERISHIFY_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAANQ1zwAAAAAAc9cyCsVySo%2BjAucC1n11ekTx4cE%3DOT6sbheYSDEGklsQHFA6ao5vdlYRRf6CpqQIqO7L3nmAUUj1PP';
