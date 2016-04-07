var port    = 9000,
    express = require('express'),
    app     = express();

//var path = require('path');

var mysql = require('mysql'),
    survey_app = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'survey_app'
    });
survey_app.connect();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(express.static(__dirname + '/static'));
app.get('/get-questions', function(req, res) {
    var myQuery = "SELECT * FROM questions";
    survey_app.query(myQuery, function(err, rows) {
        if(err){
            console.log(err);
        } else {
            res.end(JSON.stringify(rows));
        }
    });
});
app.get('/get-courses', function(req, res) {
    var myQuery = "SELECT * FROM courses";
    survey_app.query(myQuery, function(err, rows) {
        if(err){
            console.log(err);
        } else {
            res.end(JSON.stringify(rows));
        }
    });
});
app.post('/post-responses', function(req, res) {
    var myQuery = `INSERT INTO responses (c_id, q1, q2, q3) VALUES ('${req.query.c_id}', ${req.query.q1}, ${req.query.q2}, ${req.query.q3})`;
    survey_app.query(myQuery, function(err, rows) {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            res.end("Survey submitted successfully!");
        }
    });
});

app.listen(port);
console.log("Node listening on port " + port);