function init(app, User, Article) {
    app.post("/admin/board", function (req, res) {
        Article.find().exec(function(err, result){
            if(err){
                console.log('/admin/board Error');
                res.send(401, result);
            }
            res.send(200, result);
        });
    });

    app.post('/admin/user', function (req, res) {
        User.find().exec(function(err, result){
            if(err){
                console.log("/admin/user Error");
                res.send(401, result);
            }
            res.send(200, result);
        });
    });

    app.post('/admin/report', function (req, res) {
        Article.find({ reports: { $exists: true, $not: {$size: 0} } }).exec(function (err, result) {
            if(err){
                console.log("/admin/user Error");
                res.send(401, result);
            }
            res.send(200, result);
        })
    })
}

module.exports = init;