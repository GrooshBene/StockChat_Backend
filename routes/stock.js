/**
 * Created by GrooshBene on 2017-04-22.
 */
function init(app, User, Stock){
    var googleFinance = require('google-finance');
    app.post('/stock/search/:id', function(req, res){
        var date = new Date();
        googleFinance.historical({
            symbol : "NASDAQ:AAPL",
            from : date.setDate(date.getDate()-1),
            to : date
        }, function(err, quotes){
            if(err){
                res.send(401, "Unvalid Access");
                throw err;
            }
            console.log(quotes);
            res.send(200, quotes);
        })
    })
}
module.exports = init;