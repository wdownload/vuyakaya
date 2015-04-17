function inicialize(){
	var UsuarioController = require('../controller/Usuario').UsuarioController,
		Usuario = require('../model/user').Usuario;


	Usuario.findOne({username: 'teste'}, function(err, user){
		if(err) console.log(err); else if(!user){
			var user1 = new Usuario();
			user1.name = "Teste de User";
			user1.username = "teste";
			user1.password = "teste";
			user1.desc = "Usuario criado apenas para teste. Ignore-o se for possivel";
			user1.region = "Sem regiao";
			user1.city = "Sem Cidade";
			user1.date = new Date();

			UsuarioController.criar(user1, function(err, res){if(err) console.log(err); else console.log(res.message)});
		}
	});

}

exports.inicialize = inicialize;