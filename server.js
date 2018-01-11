var app = require('./app');
app.set('port', 3000);
var server = app.listen(app.get('port'), () => {
  console.log(`Server running at port ${server.address().port}`);
});
