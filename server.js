var express = require("express"),
app = express(),
server = require("http").createServer(app),
Tiny = require("tiny"),
port = process.env.PORT || 8000;

function raiseEvent (evtType, entityId, body, callback) {
    eventId++;
    db.set(eventId, {
        evt: evtType,
        id: entityId,
        body: body
    }, function (err) {
        callback(err);
    });
}

var db;
Tiny('eventstore.tiny', function (err, db_) {
    if (err) throw err;
    db = db_;
});
var eventId = 0;

app.use(express.static('app'));
app.use(express.bodyParser());

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
            {id: 1, description: "Apples", amount: 1},
            {id: 2, description: "Baked Beans", amount: 2},
            {id: 3, description: "Cheddar Cheese", amount: 700 },
            {id: 4, description: "Chick Peas", amount: 2},
            {id: 5, description: "Cat Food"}
        ]
    };
    res.json(viewData);
});

app.post('/command/purchaseItem', function (req, res) {
    console.log("PurchaseItem command", req.body);
    setTimeout(function () {

        if (req.body.id === 3) {
            res.json({message: "Item has already been purchased by Justine"})
        } else {
            raiseEvent('ItemPurchased', req.body.id, req.body, function (err) {
                if (err) {
                    throw err;
                }
                console.log("EventStored");
                res.end();

            });
        }
    },3000);
});


app.get('/events/dump', function (req, res) {
    var response = "";
    db.each(function (data) {
        response += JSON.stringify(data);
    }, function () {
        res.send(response);
    });
});

server.listen(port);
console.log("Server listening on port", port);
