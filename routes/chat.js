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
		var keyboard = {
			"type" : "buttons",
			"buttons" : ["주식정보", "주톡으로 연결"]
		}
		res.send(200, keyboard);
	})
}

module.exports = init;
