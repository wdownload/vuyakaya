var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var passport = require('./config/auth');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var flash    = require('connect-flash');
var expressSession = require('express-session');
var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'Come back home', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Controllers...
var UsuarioController = require('./controller/Usuario').UsuarioController;

//Models...
var Usuario = require('./model/user').Usuario;

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
        return next();
    return res.redirect('/login');
}


app.get('/', function(req, res, next) {
    console.log( req.user)
  UsuarioController.selecionarTodos(function(err, usuarios){
    if (err) res.render('error');
    res.render('index', {users: usuarios, logado: req.user});
  });
});

app.get('/login', function(req, res, next) {
  res.render('login', {message: req.flash('message')});
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

app.get('/location', isLoggedIn, function(req, res) {
    console.log( req.user)
  res.render('location', {user: req.user.data});
});

app.post('/location/:id', function(req, res) {
    var identificador =req.params.id;
    var user =new Usuario();
    user._id = identificador;

    if(req.body.desc){
        user.desc = new String(req.body.desc);
    }
    if(req.body.region){
        user.region = new String(req.body.region);
    }
    if(req.body.city){
        user.city = new String(req.body.city);
    }

    UsuarioController.actualizar(user, function(err,result){
        if(err){
            res.render('error', {message: err.message});
        }else if(!result.success){
            res.render('error', {message: result.message});
        }else{
            console.log(result);
            res.redirect('/');
        }
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/location',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/pessoas', function(req, res){

    var character = req.body.searchVal;
    UsuarioController.selecionarCaracter(character, function(err, usuarios){
        if (err) res.render("error");
        console.log(usuarios);
        res.send(usuarios);
    });
});

app.get('/pessoas/new', function(req, res){
    res.render('novo_usuario');
});

app.post('/pessoas/new', function(req, res){
    console.log(req.body);
    var newUser = new Usuario();
        newUser.name = req.body.name;
        newUser.username = req.body.username;
        newUser.password = req.body.password;
        if(req.body.desc){
            newUser.desc = req.body.desc;
        }
        if(req.body.region){
            newUser.region = req.body.region;
        }
        if(req.body.city){
            newUser.city = req.body.city;
        }
        newUser.date = new Date();

    UsuarioController.criar(newUser, function(err, result){
        if(err) console.log(err); 
        else if (result.success) res.redirect('/login');
    });
});

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

var dbUrl = require('./config/db').url,
    db = mongoose.connection;

db.on('error', function(){
  console.log('Nao foi possivel connectar a BD: '+dbUrl);
});
db.once('open', function(){
    console.log('Conectado a bd com sucesso');

    var inicialize = require('./config/init').inicialize;
    
    inicialize();
    
    //Starting app
    server = app.listen(port);
    console.log('App started at port '+port)

    // //SocketIO
    // require('./config/socket-io')(server);
});

mongoose.connect(dbUrl);
