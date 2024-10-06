const limiter = require('express-rate-limit');

const rateLimiter= limiter({
    windowMs: 30 * 1000, 
    max: 5, // Limit each IP to 30 seconds , 5 requests
    message: 'Too many requests, please try again later.',
});


module.exports= rateLimiter