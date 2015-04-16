var express = require('express');
var app= express(); 
app.use('/',express.static('./'));
app.get('/customer*',function(req,resp,next){
	resp.sendFile(__dirname +'/index.html');
});

app.listen(8090);
