var passport = require('passport'),
	User = require('../model/user').Usuario,
	bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy;
    UsuarioController = require('../controller/Usuario').UsuarioController;

   	

passport.use(new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true

},

function(req, username, password, next){
	//validar usuario e senha
    UsuarioController.validarLogin(username, password, function(err, result){
        if(err)return next(err);

        if(!result.success){
            next(null, false, req.flash('message', result.message));
        }
        else{
            next(null, result.data);
        }
    });
}));




    passport.serializeUser(function(user, next) {
    	if (user === undefined) {
    		next(null,null);
    	};
        next(null, user._id);
    });

    passport.deserializeUser(function(id, next) {
        UsuarioController.selecionarId(id, next);
    });

module.exports = passport;