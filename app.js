const http = require('http');

http.createServer(function(req, res) {

res.write('on the way to fullstack engineer');
res.end();

}).listen(3000);

console.log(`Server Started on port 3000`)



