$(function(){

	// Getting People list


	$('#peopleSearch').submit(function(evt){
		evt.preventDefault();
		var data = $('#peopleSearch').serialize();
		getPeople(data);
	});

	$('.detUser').on('click', function(){

		
		var id = $(this).attr("valor");
		getPersonDetail(id);
	});

	// Getting people list
	function getPeople(data){
		var link = '/pessoas';
		searchAjax(link, data, function(result){
			if (result.data.length) {
				$('#procResult').html('');		
				for(var i = 0; i < result.data.length; i++){
					$('#procResult').append('<a href="#" data-toggle="modal" data-target="#userDetails" class="detUser" valor="'+result.data[i]._id+'"><h4>'+result.data[i].name+'<span class="span-det">'+result.data[i].city +' - '+ result.data[i].region+'</span></h4></a>');			
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
	