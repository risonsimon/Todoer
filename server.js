var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan'); // log requests to the console
var bodyParser = require('body-parser'); // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT
var configConstants = require('./config');


var app = express();

mongoose.connect(configConstants.mongoLocal);

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//model====================
var Todo = mongoose.model('Todo',{
    text: String
});


//routes =============================

//to get all todos
app.get('/api/todos',function(req,res){

    //get all todos
    Todo.find(function(err,todos){

        //if error then send error and stop executing
        if(err)
        {
            res.send(err);
        }
        res.json(todos); //return todos in json format.
    });
});

//to create a new todos and return all todos
app.post('/api/todos', function(req,res) {

    Todo.create({
       text: req.body.text,
         done:false
    }, function (err, todo) {
        if(err)
            res.send(err);
    });
    //get all todos
    Todo.find(function(err,todos){

        //if error then send error and stop executing
        if(err)
        {
            res.send(err);
        }
        res.json(todos); //return todos in json format.
    });

});

//to delete a todos
app.delete('/api/todos/:todo_id', function (req,res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err,todo) {
        if(err)
            res.send(err);

        //return all todos
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

//var index = require('./public/index.html')
//app.route('/').get();

app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});


//end routes

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");