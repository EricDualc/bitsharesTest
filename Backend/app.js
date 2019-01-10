var express = require('express')
var cors = require('cors');
var bodyparser = require('body-parser');
var engines = require('consolidate');

var router = express.Router();
var app = express(); 
var server = require('http').Server(app);
var port = 4002;

app.engine('html', engines.hogan);
app.set('view engine', 'html');
app.use(cors());

// body-parser
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

app.use('/', express.static('public'))

var routes = require('./routes')(router);

app.use('/', routes);

server.listen(port, function(){
  console.log("BitSharesTest server  running %d port", port);
});


