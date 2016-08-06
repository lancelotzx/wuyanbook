var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users')

var app = express();

var wechat = require('wechat');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.query()); // Or app.use(express.query());
app.use('/wechat', wechat('blablablabla', function (req, res, next) { //token add
 // 微信输入信息都在req.weixin上
 var message = req.weixin;
 console.log(message);

 if((message.MsgType == 'event') && (message.Event == 'subscribe'))
 {

  var registerStr = "<a href=\"http://www.wylib.top/register.html?weixinId=" + 
  message.FromUserName + "\">1. 点击开始注册</a>" 
  var refillStr = "<a href=\"http://52.10.69.3/weixin/refill?weixinId=" + 
  message.FromUserName + "\">1. 点击查看当前借阅</a>"     
  var consumeStr = "<a href=\"http://52.10.69.3/weixin/consume?weixinId=" +
   message.FromUserName + "\">2. 点击查看书单</a>"
  var deleteStr = "<a href=\"http://52.10.69.3/weixin/delete?weixinId=" + 
  message.FromUserName + "\">3. Show me lucky one</a>"      
  var historyStr = "<a href=\"http://52.10.69.3/weixin/history?weixinId=" + 
  message.FromUserName + "\">4. 点击查询历史记录</a>"
      
  var emptyStr = "          ";    
  var replyStr = "感谢你的关注！" + "\n"+ emptyStr + "\n" +registerStr +"\n"+ refillStr + "\n"+ 
  emptyStr + "\n" + consumeStr  + "\n"+ emptyStr + "\n" + deleteStr + "\n"+ 
  emptyStr + "\n" + historyStr;
  res.reply(replyStr);
 }
if(message.MsgType == 'text')
{
    res.reply({ type: "text", content: "you input " + message.Content + "\n"+
    "you are" + message.FromUserName});  
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
