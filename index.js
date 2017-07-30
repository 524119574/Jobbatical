var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use('/api/v1', require('./routers/router.js'));

if(!module.parent){ 
    app.listen(3000); // avoid listening on the test suite
}
// app.listen(3000);

module.exports = app;