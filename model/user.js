var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	//Localidade {Regiao, cidade}
	region: String,
	city: String,
	username: String, //Username e pass, para autenticacao
	password: String,
	desc: String, // Descricao do estado em que se encontra, entre outras informacoes.
	date: Date
});

var Usuario = mongoose.model('Usuario', schema);

exports.Usuario = Usuario;