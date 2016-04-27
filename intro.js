// General things {{{
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
// }}}
app.use(express.static(__dirname + '/static'));
// get requests {{{
app.get('/get-questions', function(req, res) {
    var myQuery = "SELECT * FROM questions";
    survey_app.query(myQuery, function(err, rows) {
        if(err){
            console.log(err);
        } else {
            var sender = rows.filter(function(a) {return eval(a.active);});
            res.end(JSON.stringify(sender));
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

// }}}
// functions for posting responses {{{
//
function valid(response, testKeys) {
    return testKeys.map(function(x) {
        return response[x];
    }).reduce(function(a, x) {
        var y = Number(x);
        return a && (0 < y) && (y <= 5);
    }, true);
}
function makeResp(r_ID, q_ID, resp) {
    return "INSERT INTO responses (r_ID, q_ID, resp) VALUES ('" + r_ID + "', '" + q_ID + "', '" + resp + "')";
}
function getKeys(obj) {
    return Object.keys(obj).filter(function(x) {
        return /^q[0-9]*$/g.test(x);
    });
}
// }}}
//Posting the response {{{
//
app.post('/post-responses', function(req, res) {
    console.log(req.query);
    var qKeys = getKeys(req.query);
    function respQueries(req, res, rows) {
        var num = 1;
        function iter() {
            if (num > qKeys.length)
                res.end("Successful submission!");
            else {
                var query = "INSERT INTO responses (r_ID, q_ID, resp) VALUES ('" + rows.insertId + "', '" + num + "', '" + req.query["q" + num] + "')";
                num++;
                survey_app.query(query, iter);
            }
        }
        return iter();
    }
    if(valid(req.query, qKeys)) {
        var resp_join = "INSERT INTO responses_join (c_ID) VALUES ('" + req.query.c_id + "')";
        survey_app.query(resp_join, function(err, rows) {
            if(err){
                console.log(err);
                res.end(err);
            } else {
                respQueries(req, res, rows);
            }
        });
    }
});
// }}}

app.listen(port);
console.log("Node listening on port " + port);
