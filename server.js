var express = require('express');


var app = express();
var port = 8080;

var router = require('./app/router');

app.set('view engine', 'ejs');
app.use('/', router);

app.listen(port, function () {
	console.log('app started');
});
