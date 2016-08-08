var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');  
var https = require("https");  

//var http  = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var db = require('./mongodbcon');

var app = express();

var wechat = require('wechat');

//add for customed menu with QRcode scan
var API = require('wechat-api');
var api = new API('wxcb602c7b716c5ccc', '458d35a4def8277722cf954f9956c3c0');

api.getAccessToken(function (err, token) {  
    console.log(err);  
    console.log(token);  
}); 

var menu = fs.readFileSync('wechat-menu.json');  
  if(menu) {  
    menu = JSON.parse(menu);  
    console.log(menu);
  }  
  api.createMenu(menu, function(err, result){
    console.log(result);
  }); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.query()); 

//进行页面的Control处理
//所有页面入口默认为/logincheck,从weixin入口的入口页
//从regitster提交的表单处理 
/*http://yijiebuyi.com/blog/90c1381bfe0efb94cf9df932147552be.html */
/*form 先使用www-form-urlencoded方式*/
/*必须先db读库，确认appid不存在，再insert用户表*/
app.post('/logincheck',function(req, res){  
      console.log('come in logincheck');
      console.log(req.body);
      if(req.body.uname!= null && req.body.uzid != null &&
         req.body.percode == '1919'){ //邀请码先硬编码写入
            var user = {'username':req.body.uname,'userzid':req.body.uzid,'appid':req.body.weixinid};
            req.session.user = user;
            console.log(user);
            //res.redirect('/admin/app/list');
          }
          
      });  


//下面是weixin的对话交互业务处理代码
app.use('/wechat', wechat('blablablabla', function (req, res, next) { 
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log(message);

  var registerStr = "<a href=\"http://www.wylib.top/register?weixinId=" + 
  message.FromUserName + "\">1. 点击开始注册</a>" 
  var refillStr = "<a href=\"" + 
  message.FromUserName + "\">2. 点击查看当前借阅</a>"     
  var consumeStr = "<a href=\"" +
   message.FromUserName + "\">3. 点击查看书单</a>"
  var deleteStr = ""      
  var historyStr = "<a href=\"http://52.10.69.3/weixin/history?weixinId=" + 
  message.FromUserName + "\">4. 点击查询历史记录</a>"
      
  var emptyStr = "          ";    
  var replyStr = "感谢你的关注！输入m获取此菜单" + "\n"+ emptyStr + "\n" +registerStr +"\n"+ 
  emptyStr + "\n" + refillStr + "\n"+ emptyStr + "\n" + consumeStr  + "\n"+
  emptyStr + "\n" + historyStr;
 
 ///////下面是测试成功的数据库连接代码
 //var  mongodb = require('mongodb');
 //var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
 //var  mydb = new mongodb.Db('mydb', server, {safe:true});
 //db.dbcon(mydb);
 ////////

 if((message.MsgType == 'event') && (message.Event == 'subscribe'))
 { 
  res.reply(replyStr);
 }

if(message.MsgType == 'text')
{
    res.reply({ type: "text", content: "you input " + message.Content + "\n"+
    "your appid is" + message.FromUserName}); 
    if((message.Content == 'm') || (message.Content == 'M'))
    {
      res.reply(replyStr);
    }
}
//test qrcode && douban API
if((message.MsgType == 'event')&&(message.Event == 'scancode_waitmsg'))
{
    var isbncode = (message.ScanCodeInfo.ScanResult.split(/,/))[1];
    //console.log("here"+ + message.ScanCodeInfo + "sss\n" + message.ScanCodeInfo.ScanResult);

    //douban API get book info by ISBNcode
    var url = 'https://api.douban.com/v2/book/isbn/'+isbncode;
    https.get(url, function (res) {  
    var datas = [];  
    var size = 0;  
    res.on('data', function (data) {  
        datas.push(data);  
        size += data.length;  
    //process.stdout.write(data);  
    });  
    res.on("end", function () {  
        var buff = Buffer.concat(datas, size); 
        var bookJSON = buff.strify(buff); 
        //var result = buff.toString();//不需要转编码,直接tostring 
        res.reply("isbn is " + isbncode +"\n" + "图书简介:" + bookJSON.summary + "\n");
 
        console.log(result);  
    });  
    }).on("error", function (err) {  
        Logger.error(err.stack)  
        callback.apply(null);  
    });

}

}));



app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//console.log('注册路由.');

//routes(app);


module.exports = app;