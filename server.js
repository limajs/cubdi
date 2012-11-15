var express = require("express"),
app = express(),
server = require("http").createServer(app),
port = process.env.PORT || 8000;

app.use(express.static('app'));

app.get('/', function (req, res) {
    res.sendfile("app/index.html");
});

server.listen(port);
console.log("Server listening on port", port);
