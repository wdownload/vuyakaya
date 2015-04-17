$(function(){

	// Getting People list
	$('#pesqPeople').on('click', function(evt){
		var data = $('#peopleSearch').serialize();
		getPeople(data);
	});

	$('#peopleSearch').submit(function(evt){
		evt.preventDefault();
	});

	$('.detUser').on('click', function(){
		var id = $(this).attr("valor");
		getPersonDetail(id);
	});

	// Getting people list
	function getPeople(data){
		var link = '/people';
		searchAjax(link, data, function(result){
			if (result.data.length) {
				$('#procResult').html('');		
				for(var i = 0; i < result.data.length; i++){
					$('#procResult').append('<table class="table"><tbody><tr id="det"'+i+'><td><a href="#" data-toggle="modal" data-target="#userDetails" class="detUser" valor="Nome: '+result.data[i].name+' Cidade: '+result.data[i].city+' - '+result.data[i].region+' Descicao: '+ result.data[i].desc+'">'+result.data[i].name+'</a></td><td style="text-align: right;"><a href="#" data-toggle="modal" class="detUser" data-target="#userDetails" valor="Nome: '+result.data[i].name+' Cidade: '+result.data[i].city+' - '+result.data[i].region+' Descicao: '+ result.data[i].desc+'">'+result.data[i].city +' - '+ result.data[i].region+'</a></td></tr></tbody></table>');		
				}	
			}else{
				$('#procResult').html("Nenhum resultado foi encontrado");
			};
			
		});
	}

	// Getting Person details
	function getPersonDetail(id){
		var link = '/pessoas/'+id;
		searchAjax(link, "a", function(result){
			if (result) {
				$('#detalhesuser').html('Nome: '+result.name+'<br>Cidade: '+result.city+'<br>Regiao: '+result.region+'<br>Outras informacoes: '+result.desc);	
			}else{
				$('#detalhesuser').html("Nenhum resultado foi encontrado");
			};
			
		});
	}

	function searchAjax(link, data, callback){
		$.ajax({
			url: link,
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: function(){
				$('#detalhesuser').html('');
				$('.load').show();
			},
			complete: function(){
				$('.load').hide();
			},
			success: function(data, textStatus, xhr){
				return callback(data);
			},
			error: function(xhr, textStatus, errorThrown){
				$('#printContent').html("Ocorreu um erro ao buscar os dados. Tente novamente.");
			}
		});
	}
});	
	