var mongoose = require('mongoose'),
	Usuario = require('../model/user').Usuarios,
	Actividade = require('../model/activities').Actividades,
	Relatorio = require('../model/relatories').Relatorios,
	Rota = require('../model/routes').Rotas;

var ActividadeServico = require('../controller/servicos/ActividadeServico').ActividadeServico,
	RelatorioServico = require('../controller/servicos/RelatorioServico').RelatorioServico,
	RotaServico = require('../controller/servicos/RotaServico').RotaServico,
	UsuarioServico = require('../controller/servicos/UsuarioServico').UsuarioServico;

module.exports = function(server) {

	var io = require('socket.io').listen(server);
	global.io = io;

	io.on('connection', function (socket) {
		var socketid = socket.id;
		console.log("User connected with id ", socketid);


		// Login event
		socket.on('login', function(user, password){

			UsuarioServico.validarLogin(user, password, function(err, user){
				if (err) return handleError(err);
				if (!user.success) {
					console.log("Login falhou. Tente novamente");
					socket.emit('login', false, "Recusado");
				}else if (user.success) {
					socket.emit('login', true, "Aceite", user.data.name);
				};
			});
		});


		// Get user and date, activitie event
		socket.on('actividades', function(userName, date){
			var actividade = new Actividade();
				actividade.user = userName;
				actividade.date = date;

			ActividadeServico.procurar(actividade, function(err, activitie){
				if (err) return handleError(err);
				if(!activitie.success){ socket.emit('actividades', true, "Sem actividades")};

				if (activitie.success) {
					console.log("Actividade enviada: "+activitie.data);
					socket.emit('actividades', true, activitie.data.name, activitie.data.contentores, userName);
				};
			});
		});


		// Waiting to receive relatories...
		socket.on('relatorio', function(data){
			var relatorio = new Relatorio();
				relatorio.user = data.id;
				relatorio.date = data.data;

				relatorio.route = data.rota;
			var estados = data.estado.split(';');
				relatorio.contentores = [];

			ActividadeServico.procurar(relatorio, function(err, route){
				if (err) return handleError(err);
				if(!route.success){ socket.emit('relatorio', true, "A rota nao foi encontrada.")};

				if (route.success) {
					console.log(route.data.contentores);
					for(var i = 0; i<route.data.contentores.length; i++){
						var a = {name: route.data.contentores[i].name, estado: estados[i]};
						relatorio.contentores.push(a);
					};
					console.log("Relatorios: ",relatorio.contentores);
					RelatorioServico.criar(relatorio, function(err, result) {
						if (err) return handleError(err);
						if(!result.success){
							socket.emit('relatorio', true, "Sem relatorios.");
						}
						if (result.success) {
							socket.emit('relatorio', true, "Relatorio criado com sucesso.");
						};
					});
				};
			});			
		});
	});
}