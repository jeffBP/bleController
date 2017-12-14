var express = require('express');
var path = require('path');
var app = express();
var port = 8080;




app.listen(port, function () {
	console.log('app started');
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});
