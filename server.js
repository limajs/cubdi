var express = require("express"),
app = express(),
server = require("http").createServer(app);

app.use(express.static('app'));

app.get('/', function (req, res) {
    res.sendfile("app/index.html");
});

server.listen(8001);
console.log("Server listening on port 8001");
