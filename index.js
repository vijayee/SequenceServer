var express    = require('express');
var bodyParser = require('body-parser');
var levelup = require('levelup');
var Sequence = require('base62sequence');

var port = process.env.PORT || 8080;
var db = levelup('./sequencedb');
var app= express();
var router = express.Router();

app.use(bodyParser.json());
app.use(router);

//used to stop stack traces from being reported in response body
app.use(function(err, req, res, next) {
    err.stack= null
    res.sendStatus(err.statusCode);
});

var cache = {};
var prefix;

router.post('/', function(req, res) {
    //reject request with broken json fields
    if(!req.body || !req.body.type || !req.body.db){
        res.sendStatus(400);
    }
    var key = req.body.type + '-' + req.body.db
    if(req.body.clientPrefix){
        key += '-' + req.body.clientPrefix;
    }
    //cache hit
    if (cache[key]){
        var next = cache[key].next();
        //store current sequence to db
        db.put(key, cache[key].current(), function (err, value) {
            if (err) {
                cache[key] = null;
                return res.sendStatus(500);
            } else {
                res.json({ID: next});
            }
        });
    } else {//cache miss
        db.get(key, function (err, value) {
            var next;
            //start sequence from db
            if (value) {
                cache[key] = new Sequence(value);

            } else {
                cache[key] = new Sequence(0);
            }
            next = cache[key].next();
            //store current sequence
            db.put(key,  cache[key].current(), function (err) {
                if (err) {
                    cache[key] = null;
                    return res.sendStatus(500);
                } else {
                    res.json({ID: next});
                }
            });
        });
    }

});

router.post('/clientprefix', function(req, res) {
    var key='client-prefix';
    if (prefix){
        var next = prefix.next();
        //store current sequence to db
        db.put(key, prefix.current(), function (err, value) {
            if (err) {
                prefix = null;
                return res.sendStatus(500);
            } else {
                res.json({prefix: next});
            }
        });
    } else {
        db.get(key, function (err, value) {
            var next;
            //start sequence from db
            if (value) {
                prefix = new Sequence(value);

            } else {
                prefix = new Sequence(0);
            }
            next = prefix.next();
            //store current sequence
            db.put(key,  prefix.current(), function (err) {
                if (err) {
                    prefix = null;
                    return res.sendStatus(500);
                } else {
                    res.json({prefix: next});
                }
            });
        });
    }
});

app.listen(port);
console.log('SequenceServer listening on port ' + port + '\n');