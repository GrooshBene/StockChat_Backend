/**
 * Created by GrooshBene on 2017-04-22.
 */

function init(app, User, Stock) {
    app.io = require('socket.io');

    app.post('/chat/join/:id', function (req, res) {
        io.on('connection', function (socket) {
            var addedUser = false;

            socket.on('new message', function (data) {
                socket.broadcast.emit('new message', {
                    username: socket.username,
                    message: data
                });
            });

            socket.on('add user', function (username) {
                if (addedUser) return;

                socket.username = req.session.name;
                ++numUsers;
                addedUser = true;
                socket.emit('login', {
                    numUsers: numUsers
                });
                socket.broadcast.emit('user joined', {
                    username: socket.username,
                    numUsers: numUsers
                });
            });

            socket.on('typing', function () {
                socket.broadcast.emit('typing', {
                    username: socket.username
                });
            });

            socket.on('stop typing', function () {
                socket.broadcast.emit('stop typing', {
                    username: socket.username
                });
            });

            socket.on('disconnect', function () {
                if (addedUser) {
                    --numUsers;

                    socket.broadcast.emit('user left', {
                        username: socket.username,
                        numUsers: numUsers
                    });
                }
            });
        });
    })

	app.get('/keyboard', function(req, res){
		const keyboard = {
			type : 'buttons',
			buttons : ["주식정보", "주톡으로 연결"]
		}
		res.set({
			'content-type' : 'application/json'
		}).send(JSON.stringify(keyboard));
    })
    app.post('/message', function(req, res){
        const _obj = {
            user_key : req.body.user_key,
            type : req.body.type,
            content : req.body.content
        };
        let message1 = {
            "message" : {
                "text" : "주식 정보입니다."
            },
            "keyboard" : {
                type : 'buttons',
                buttons : ["주식정보", "주톡으로 연결", "돌아가기"]
            }
        };
        let message2 = {
            "message" : {
                "label" : "주톡 홈페이지로 이동합니다.",
                "url" : "http://zootalk.com"
            },
            "keyboard" : {
                type : 'buttons',
                buttons : ["주식정보", "주톡으로 연결", "돌아가기"]
            }
        };

        if(_obj.content == "주식정보"){
            res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(message1));
        }
        else if(_obj.content == "주톡으로 연결"){
            res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(message2))
        }

    })
}

module.exports = init;
