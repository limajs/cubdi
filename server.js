var express = require("express"),
app = express(),
server = require("http").createServer(app),
Tiny = require("tiny"),
port = process.env.PORT || 8000,
eventId = 0,
db;

Tiny('eventstore.tiny', function (err, db_) {
    if (err) throw err;
    db = db_;

    console.log("Args", process.argv);
    if (process.argv[2] === 'rebuild-demo-data') {
        db.kill(function (err) {

            raiseEvent("ItemAddedToShoppingList", 1, {id:1, description: "Apples", amount: 1}, function (err) {
                console.log("Added Apples");
            });
            raiseEvent("ItemAddedToShoppingList", 2, {id:2, description: "Baked Beans", amount: 2}, function (err) {
                console.log("Added Baked Beans");
            });
            raiseEvent("ItemAddedToShoppingList", 3, {id:3, description: "Cheddar Cheese", amount: 700}, function (err) {
                console.log("Added Cheddar Cheese");
            });
            raiseEvent("ItemAddedToShoppingList", 4, {id:4, description: "Chick Peas", amount: 2}, function (err) {
                console.log("Added Chick Peas");
            });
            raiseEvent("ItemAddedToShoppingList", 5, {id:5, description: "Cat Food"}, function (err) {
                console.log("Added Cat Food");
            });
        });
    } else {
        //Replay Events
        db.each(function (evt) {
            console.log("Reading event", evt);
            eventId++;
            app.emit(evt.evt, evt.body);
        });
    }
    server.listen(port);
    console.log("Server listening on port", port);
});


var shoppingListView = {

    items: [
    ]
};

app.on('ItemAddedToShoppingList', function (item) {
    console.log("Handling ItemAddedToShoppingList", item);
    shoppingListView.items.push({
        id: shoppingListView.items.length + 1,
        description: item.description
    });
});

app.on('ItemPurchased', function (purchasedItem) {
    console.log("Handling ItemPurchased", purchasedItem);
    shoppingListView.items.filter(function (item) {
        return item.id === purchasedItem.id
    })[0].state = 'isPurchased';
});

function raiseEvent (evtType, entityId, body, callback) {
    eventId++;
    db.set(eventId, {
        evt: evtType,
        id: entityId,
        body: body
    }, function (err) {
        app.emit(evtType, body);
        callback(err);
    });
}


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
    res.json(shoppingListView);
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

app.post('/command/addItemToShoppingList', function (req, res) {
    console.log("AddItemToShoppingList command", req.body);
    raiseEvent("ItemAddedToShoppingList", req.body.id, req.body, function (err) {
        res.end();
    });
});

app.get('/events/dump', function (req, res) {
    res.download('eventstore.tiny');
});

