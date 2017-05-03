/**
 * Created by GrooshBene on 2017-04-22.
 */

function init(app, User) {
    var randomString = require('randomstring');
    var mailer = require('nodemailer'); 

    function mail_auth(reciever, id, password){
        //code here
        var token = randomString.generate(16);
        var smtpTransport = mailer.createTransport("SMTP",{
            service : "Gmail",
            auth : {
                user : id,
                pass : password
            }
        });
        var mailOptions = {
            from : '회원가입 <StockChat>',
            to : reciever,
            subject : 'StockChat 회원가입 인증 메일입니다.',
            text : token
        }
        smtpTransport.sendMail(mailOptions, function(err, result){
            if(err){
                console.log("mail_auth error");
                throw err;
            }
            console.log("Mail Sended : " + result);
        })

        return token;
    }

    function mail_send(reciever, id, password, content){
        var smtpTransport = mailer.createTransport("SMTP", {
            service : "Gmail",
            auth : {
                user : id,
                pass : password
            }
        });
        var mailOptions = {
            from : "아이디/비밀번호 복구 <StockChat>",
            to : reciever,
            subject : 'StockChat 아이디/비밀번호 인증 메일입니다',
            text : content
        }
        smtpTransport.sendMail(mailOptions, function(err, result){
            if(err){
                console.log("mail_send error");
                throw err;
            }
            console.log("Mail Sended : " + result);
        });
    }

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

    app.post('/auth/register/mail', function(req, res){
        var mail_token = mail_auth(req.param('email'), 'wltn9247', 'wltn6705');
        if(mail_token == req.param('token')){
            res.send(200, {
                result : true
            });
            console.log("User " + email + " has authenticated");
        }
        else if(mail_token != req.param('token')){
            res.send(401, {
                result : false
            });
            console.log("User " + email + " authenticate Fail");
        }
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
                    req.session.name = result.name;
                    res.send(200, result);
                }
                else if (result.password != req.param('password')) {
                    console.log("Password Error!");
                    res.send(401, "Access Denied");
                }
            }
            else{
                console.log("Can't Find User Data");
                res.send(403, "Cant't Find User Data");
            }
        })
    })

    app.post('/auth/find/id' , function (req, res) {
        //needs email sender
        User.findOne({email : req.param('email')}, function (err, result) {
            console.log("DB Founded : " + result);
            if(err){
                console.log("/auth/find/id failed");
                throw err;
            }
            if(result){
                mail_send(req.param('email'), 'wltn9247', 'wltn6705', result.id);
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
                mail_send(req.param('email'), 'wltn9247', 'wltn6705', result.password);
            }
        })
    })

    app.post('/auth/delete', function (err, result) {
        User.findOneAndRemove({_id : req.session._id}, function (err, result) {
            if(err){
                console.log("/auth/delete failed");
                res.send(401, result);
                throw err;
            }
            res.send(200, result);
        })
    })
}

module.exports = init;