let express = require('express');
let mongodb = require('mongodb');

let app = express();
let db;
let scope = ``;

app.use(express.static('public'));

let uri = 'mongodb+srv://Matheus:1EbRp8q5erjHODNv@cluster0.gac7ngk.mongodb.net/ToDoApp?retryWrites=true&w=majority';

mongodb.connect(uri, {useUnifiedTopology: true}, function(error, client) {
  db = client.db()
  app.listen(3000);
});

app.use(express.json())
app.use(express.urlencoded({extended: false}));

/*function passwd(req, res, next) {
  res.set('WWW-Athenticate', 'Basic realm="Simple Todo App"')
  console.log(req.headers.authorization);
  if (req.headers.authorization == "Placeholder") {
    next();
  } else {
    res.status(401).send("Athentication required.");
  }
}*/

app.get('/', function(req, res) {
  db.collection('list').find().toArray(function(error, items) {
    res.send(`
<!DOCTYPE HTML>
<html>
  <head>
    <meta charset="UTF-8">
    <title>To-Do App</title>
    <link href="/style.css" rel="stylesheet" type="text/css">
    <style>
    h1 {
      text-align: cente;
    }
    </style>
  </head>
  <body>
    <h1>To-Do App</h1>
    <form id="ourForm" action="/create-item" method="POST">
      <div>
        <input id="textField" name="item" type="text" autofocus autocomplete="off">
        <button>Add New Item</button>
      </div>
    </form>

    <ul id="ourList"></ul>

    <script>
    let items = ${JSON.stringify(items)};
    </script>

    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
  </body>
</html>
    `);
  });
})

app.post('/create-item', function(req, res) {
  console.log(`New item added: ${req.body.text}`);
  db.collection('list').insertOne({text: req.body.text}, function(error, info) {
    res.json(info.ops[0]);
  });
})

app.post('/update-item', function(req, res) {
  db.collection('list').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
    res.send("Success");
  });
  console.log(req.body.text);
});

app.post('/delete-item', function(req, res) {
  db.collection('list').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
    res.send("Success");
  })
})
