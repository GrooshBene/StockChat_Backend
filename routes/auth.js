/**
 * Created by GrooshBene on 2017-04-22.
 */

function init(app, User) {
    var randomString = require('randomstring');
    app.post('/auth/register', function (req, res) {
        var user = new User({
            _id : randomString.generate(13),
            id : req.param('id'),
            password : req.param('password'),
            email : req.param('email'),
            mail_service : req.param('mail_service'),
            favorite : [],
            scrap : [],
            register_day : new Date.toString(),
            current_login : "",
            point : 0
        });
        user.save(function (err, result) {
            if(err){
                console.log("DB Saving Error!");
                res.send(401, result);
                throw err;
            }
            console.log("DB Saved" + user);
            res.send(200, result);
        });
    });

    app.post('/auth', function (req, res) {
        console.log("User Login : " + req.param('id'));
        User.findOne({id : req.param('id')}, function (err, result) {
            console.log("DB Founded : "+ result);
            if(err){
                console.log("/auth/local/login failed");
                throw err;
            }
            if(result) {
                if (req.param('id') == undefined) {
                    console.log("Unvalid User Infomation");
                    res.send(403, "Unvalid User Infomation");
                }
                else if (req.param('id') != undefined && result.password == req.param('password')) {
                    console.log("User " + result.name + "Logged In");
                    req.session._id = result._id;
                    res.send(200, result);
                }
                else if (result.password != req.param('password')) {
                    console.log("Password Error!");
                    res.send(400, "Access Denied");
                }
            }
            else{
                console.log("Can't Find User Data");
                res.send(400, "Cant't Find User Data");
            }
        })
    })

    app.post('/auth/find/id', function (req, res) {
        //needs email sender
        User.findOne({email : req.param('email')}, function (err, result) {
            console.log("DB Founded : " + result);
            if(err){
                console.log("/auth/find/id failed");
                throw err;
            }
            if(result){
                //code here
            }
        })
    })

    app.post('/auth/find/pw', function (req, res) {
        //needs email sender
        User.findOne({email : req.param('email')}, function (err, result) {
            console.log("DB Founded : " + result);
            if(err){
                console.log("/auth/find/pw failed");
                throw err;
            }
            if(result){
                //code here
            }
        })
    })
}

module.exports = init;