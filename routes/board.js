/**
 * Created by GrooshBene on 2017-04-22.
 */

function init(app, Article, User) {
    var randomString = require('randomstring');
    app.post('/board/add', function (req, res) {
        var article = new Article({
            _id : randomString.generate(13),
            writer : session.name,
            content : req.param('content'),
            title : req.param('title'),
            date : new Date.toString(),
            views : 0,
            recommend : 0
        });

        article.save(function (err, result) {
            if(err){
                console.log("/board/add failed");
                res.send(401, result);
                throw err;
            }
            console.log("Article Uploaded : " + article);
            res.send(200, result);
        })
    });

    app.post('/board', function (req, res) {
        Article.find().sort({date : -1}).exec(function (err, result) {
            if(err){
                console.log("/board failed");
                res.send(401, result);
                throw err;
            }
            req.send(200, result);
        });
    });

    app.post('/board/recommend', function (req, res) {
        Article.findOneAndUpdate({_id : req.param('id')}, {$inc : {recommend : 1}}, function (err, result) {
            if(err){
                console.log('/board/recommend failed');
                res.send(401, result);
                throw err;
            }
            req.send(200, result);
        });
    });

    app.post('/board/:id', function (req, res) {
        Article.findOneAndUpdate({_id : req.param("id")},{$inc : {views : 1}},{returnNewDocument: true}, function (err, result) {
            if(err){
                console.log('/board/:id failed');
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        });
    });

    app.post('/board/scrap/:id', function (req, res) {
        User.update({_id : res.session._id}, {$push : {scrap : req.param('id')}}).exec(function (err, result) {
            if(err){
                console.log("/board/scrap/:id failed");
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        });
    });

    app.post('/board/delete/:id', function (req, res) {
        Article.remove({_id : req.param('id')}, function (err, result) {
            if(err){
                console.log("/board/delete/:id failed");
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        })
    })
}

module.exports = init;
