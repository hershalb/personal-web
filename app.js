var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var routes = require('./sample');

var conversation = watson.conversation({
  username: '10adee1f-924d-4a95-a1af-b64c0d4c2264',
  password: '6TBRj4OKqjnN',
  version: 'v1',
  version_date: '2016-09-20'
});

var hostname = 'localhost';
var port = 3000;
var workspace_id = "15d39c17-f8b5-4a27-8dc6-a264c7e794a7";

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

var context = {};

// conversation.message({
//   workspace_id: '2f569318-32c5-494f-ae28-32ca2990b7e9',
//   input: {'text': ''},
//   context: context
// },  function(err, response) {
//   if (err)
//     console.log('error:', err);
//   else {
//     console.log(JSON.stringify(response, null, 2));
//   }
// });


app.use(express.static(__dirname + '/public'));

app.post('/api/message', function(req, res) {
  var payload = {
    workspace_id: workspace_id,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    console.log(JSON.stringify(data, null, 2));
    return res.json(data);
  });
});

app.use('/', routes);

module.exports = app;
