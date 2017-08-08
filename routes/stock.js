/**
 * Created by GrooshBene on 2017-04-22.
 */
function init(app, User, Stock){
	var request = require("request");
	var pythonshell = require("python-shell");
//    app.post('/stock/search/:id', function(req, res){
//        var date = new Date();
//        googleFinance.historical({
//            symbol : req.param('id'),
//            from : date.setDate(date.getDate()-1),
//            to : date
//        }, function(err, quotes){
//            if(err){
//                res.send(401, "Unvalid Access");
//                throw err;
//            }
//            console.log(quotes);
//            res.send(200, quotes);
//        })
//    });
	// setInterval(function(){
	// 	pythonshell.run('./list.py', function(err){
	// 		if(err){
	// 			throw err;
	// 		}
	// 		console.log("Update Finished");
	// 	})
	// }, 60000)
	app.post('/stock/search/:name', function(req, res){
		Stock.findOne({ title : req.param('name')}, {}, {new : true}, function(err, result){
			if(err){
				res.send(401, "DB Error");
				throw err;
			}
			// console.log(result);
			request("http://polling.finance.naver.com/api/realtime.nhn?query=SERVICE_ITEM:" + result.code, function(err, response, body){
				var _obj = JSON.parse(body).result.areas[0].datas[0];
				result.current_val = _obj.nv;
				result.yesterday_val = _obj.sv;
				if(_obj.nv > _obj.sv){
					result.up_down = "up";
				}
				else if(_obj.nv < _obj.sv){
					result.up_down = "down";
				}
				result.diff_percentage = _obj.cr;
				chat = "";
				result.save(function(err){
					res.send(200, result);
				})
			});
			});
	});

	app.post('/stock/list', function(req, res){
		Stock.find({}, function(err, result){
			if(err){
				res.send(401, "DB Error");
				throw err;
			}
			console.log(result);
			res.send(200, result);
		});
	});

	app.post('/stock/query', function(req, res){
		var data = [];
		Stock.find({}, function(err, result){
			if(err){
				res.send(401, "DB Error");
				throw err;
			}
			for(var i=0; i < result.length; i++){
				if (result[i].title.indexOf(req.param('query')) != -1) {
                	data.push(result[i]);
            	}
			}
			res.send(200, data);
		});
	});
}
module.exports = init;
