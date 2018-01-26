var express = require('express');
var path = require('path');
var app = express();
var port = 8080;



app.use(express.static('public'));


app.listen(port, function () {
	console.log('app started');
	console.log(__dirname);
});

app.get('/', function(req, res) {
	
	res.sendFile(path.join(__dirname + '/index.html'));
});
