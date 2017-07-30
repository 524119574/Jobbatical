var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use('/api/v1', require('./routers/router.js'));

app.listen(3000);