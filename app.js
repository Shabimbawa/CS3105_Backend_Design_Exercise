const express = require('express');
const app= express();
const port = process.env.PORT || 3000;
const routes= require('./routes/user');
 const rateLimiter= require('./middleware/rateLimiterMiddleware');
 const log = require('./middleware/loggingMiddleware');

app.use(express.json());
app.use(rateLimiter)
app.use(log)
app.use('/', routes);




app.listen(port, () => console.log(`Server running on port ${port}`));