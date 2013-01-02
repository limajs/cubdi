var express = require("express"),
app = express(),
server = require("http").createServer(app),
db = require("dirty")("eventstore.db"),
port = process.env.PORT || 8000,
eventId = 0;

console.log("Starting Cubdi Server");

db.on("load", function () {
    //replay events
    db.forEach(function (key, evt) {
        console.log("Replaying Event", key, evt);
        eventId++;
        app.emit(evt.evtType, evt.body);
    });
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
    var viewItem = shoppingListView.items.filter(function (item) {
        return item.id === purchasedItem.id
    });
    if (viewItem[0]) {
        viewItem[0].state = 'isPurchased';
    } else {
        console.log("Can't find purchasedItem in view");
    }
});

function raiseEvent (evtType, entityId, body, callback) {
    eventId++;
    db.set(eventId, {
        evtType: evtType,
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
        //if (req.body.id === 3) {
            //res.json({message: "Item has already been purchased by Justine"})
        //} else {
            raiseEvent('ItemPurchased', req.body.id, req.body, function (err) {
                if (err) {
                    throw err;
                }
                console.log("EventStored");
                res.end();
            });
        //}
    },100);
});

app.post('/command/addItemToShoppingList', function (req, res) {
    console.log("AddItemToShoppingList command", req.body);
    setTimeout(function () {
        raiseEvent("ItemAddedToShoppingList", req.body.id, req.body, function (err) {
            res.end();
        });
    }, 2000);
});

server.listen(port);
console.log("Server listening on port", port);
