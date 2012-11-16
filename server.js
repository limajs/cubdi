var express = require("express"),
app = express(),
server = require("http").createServer(app),
port = process.env.PORT || 8000;

app.use(express.static('app'));

app.get('/', function (req, res) {
    res.sendfile("app/index.html");
});

app.get('/view/main', function (req, res) {
    var viewData = {
        todaysMeals: [
            'Lasagne'
        ],
        reminders: [
            {description: "Take salmon out of the freezer"},
            {description: "Bake loaf for croutons"}
        ]
    };
    res.json(viewData);
});

app.get('/view/shoppinglist', function (req, res) {
    var viewData = {
        items: [
            {description: "Apples", amount: 1},
            {description: "Baked Beans", amount: 2},
            {description: "Cheddar Cheese", amount: 700 },
            {description: "Chick Peas", amount: 2},
            {description: "Cat Food"}
        ]
    };
    res.json(viewData);
});

server.listen(port);
console.log("Server listening on port", port);
