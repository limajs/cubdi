var express = require("express"),
app = express(),
server = require("http").createServer(app),
db = require("dirty")("eventstore.db"),
port = process.env.PORT || 8000,
eventId = 0;

console.log("Starting Cubdi Server");

db.on("load", function () {
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

var cupboardView = {
    items: [
    ]
};

app.on('ItemAddedToShoppingList', function (item) {
    console.log("Handling ItemAddedToShoppingList", item);
    shoppingListView.items.push({
        id: shoppingListView.items.length + 1,
        description: item.description,
        state: 'isRequired'
    });
});

function getItemInShoppingListView (itemId) {
    var viewItem = shoppingListView.items.filter(function (item) {
        return item.id === itemId
    });
    if (viewItem[0]) {
        return viewItem[0]
    } else {
        throw "Can't find purchasedItem in view";
    }
};

app.on('ItemAddedToBasket', function (purchasedItem) {
    console.log("Handling ItemAddedToBasket", purchasedItem);
    getItemInShoppingListView(purchasedItem.id).state = 'isPurchased';
});

app.on('ItemRemovedFromShoppingBasket', function (item) {
    console.log("Handling ItemRemovedFromShoppingBasket", item);
    getItemInShoppingListView(item.id).state = 'isRequired';
});

function removeItemFromShoppingListView (itemId) {
    for(var i=0,l=shoppingListView.length; i<l; i++) {
        if (shoppingListView[i].id = itemId) {
            shoppingListView.splice(i);
            return;
        }
    }
};

app.on('ItemPurchased', function (item) {
    console.log("Handling ItemPurchased", item);
    removeItemFromShoppingListView(item.id);
    cupboardView.items.push(item);
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

app.get('/view/cupboard', function (req, res) {
    res.json(cupboardView);
});

app.post('/command/addItemToBasket', function (req, res) {
    console.log("PurchaseItem command", req.body);
    setTimeout(function () {
        //if (req.body.id === 3) {
            //res.json({message: "Item has already been purchased by Justine"})
        //} else {
            raiseEvent('ItemAddedToBasket', req.body.id, req.body, function (err) {
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

app.post('/command/removeItemFromBasket', function (req, res) {
    raiseEvent("ItemRemovedFromShoppingBasket", req.body.id, req.body, function (err) {
        res.end();
    });
});

app.post('/command/checkoutItems', function (req, res) {
    console.log("CheckoutItems command", req.body);
    req.body.forEach(function (item) {
        raiseEvent("ItemPurchased", item.id, item, function (err) {

        });
    });
    res.end();
});

server.listen(port);
console.log("Server listening on port", port);
