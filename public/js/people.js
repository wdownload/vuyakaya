$(function(){

	// Getting relatories
	$('#pesqPeople').on('click', function(evt){
		evt.preventDefault();
		var data = $('#peopleSearch').serialize();
		getPeople(data);
	});

	function getPeople(data){
		searchAjax(data, function(result){
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

	function searchAjax(data, callback){
		$.ajax({
			url: '/pessoas',
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: function(){
				$('#pesqRel').prop('disabled', true);
				$('#loader').show();
			},
			complete: function(){
				$('#pesqRel').prop('disabled',false);
				$('#loader').hide();
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
	