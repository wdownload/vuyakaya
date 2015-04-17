var Usuario = require('../model/user').Usuario,
	mongoose = require('mongoose');
	bCrypt = require('bcrypt-nodejs');

var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}

var isValidPassword = function(user, password){
	console.log("isValidPass method...");
	return bCrypt.compareSync(password, user.password);
}

var verificarSenha = function(usuario, password, callback){
	UsuarioController.selecionar(usuario, function(err, user){
		if (err) callback(err);
		var isValid = isValidPassword(user, password);
		callback(null, isValid);
	});
}

function UsuarioController(){};

UsuarioController.prototype.criar = function(usuario, callback) {
	Usuario.findOne({username: usuario.username}, function(err, user){
		if (err) callback(err);
		else if(user) callback(null, {success: false, message: 'Ja existe um usuario com este username'});
		else{
			var pass = createHash(usuario.password);
			usuario.password = pass;
			
			usuario.save(function(err){
				if (err) return callback(err);
				callback(null, {success: true, message: 'Usuario gravado com successo.'});
			});
		}
	});
};

UsuarioController.prototype.selecionar = function(userid, callback) {
	Usuario.findOne({_id: userid}, function(err, user){
		if (err) callback(err);
		callback(null, {success: true, data: user});
	});
};

UsuarioController.prototype.selecionarNome = function(user, callback) {
	Usuario.find({name: new RegExp(caracter,'i')}).exec(function(err, users){
		if(err)	return callback(err)
		return callback(null, {success: true, data: users});
	});
};

UsuarioController.prototype.selecionarCaracter = function(caracter, callback) {
	Usuario.find().or([{name: {$regex: new RegExp(caracter,'i')}}, {region: {$regex: new RegExp(caracter,'i')}}, {city: {$regex: new RegExp(caracter,'i')}}]).sort({date: -1}).exec(function(err, users){
		if(err) return callback(err);
		callback(null, {success: true, message: "Usuarios encontrados", data: users});
	});
};

// UsuarioController.prototype.selecionarRegiao = function(regiao, callback) {
// 	// body...
// };

UsuarioController.prototype.selecionarTodos = function(callback) {
	Usuario.find({}).sort({date: -1}).limit(20).exec(function(err, users){
		if (err) return callback(err);
		return callback(null, {success: true, message: "usuario retornado com successo", data: users});
	});
};

UsuarioController.prototype.actualizar = function(usuario, callback){
	Usuario.findById(new mongoose.Types.ObjectId(usuario._id), function(err, user){
		if(err) callback(err);
		if(!user) callback(null, {success: false, message: 'Usuario nao existe na Base de Dados'});

		else{
			var identifier = new mongoose.Types.ObjectId(user._id);
			delete(usuario._id);

			console.log(usuario);

			Usuario.findOneAndUpdate({'_id':identifier},{$set: usuario},function(err, result){
				if(err) return callback(err);
				callback(null, {success: true, message: 'Dados actualizados com sucesso', data: result});
			});
		}

	});
}

UsuarioController.prototype.validarLogin = function(username, password, callback) {
	// login validate
	Usuario.findOne({username: username}, function(err, user){
		if (err) {console.log("Erro: ",err);return callback(err);};
		if(!user){console.log("User not found."); return callback(null, {success: false, message: 'Usuario nao existe na Base de Dados'})}
		else{
			if(!isValidPassword(user, password)){
				console.log("1");
				return callback(null, {success: false, message: 'Password nao esta correcta'});
			}
			else{
				console.log("Founded");
				return callback(null, {success: true, data: user});
			}
		}
	});
};

exports.UsuarioController = new UsuarioController();