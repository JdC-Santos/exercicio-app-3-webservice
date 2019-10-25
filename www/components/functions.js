// This is a JavaScript file
var id_usuario = "";
var usuarios;
$(document).on('submit','#formCadastra',function(e){
  e.preventDefault();
  var form = $('#formCadastra').serialize();
  
  
  $.ajax({
    url: 'https://jdc.profrodolfo.com.br/cadastrar.php',
    type: 'post',
    dataType: 'json',
    data: form,
    success: function(json){
      if(json.status == 1){
        navigator.notification.alert(
            'Usuário cadastrado!',  // message
            false,         // callback
            'Sucesso!',            // title
            'Ok'                  // buttonName
        );
        $('#formCadastra').trigger('reset');
      }else{
        navigator.notification.alert(
            json.msg,  // message
            false,         // callback
            'Erro!',            // title
            'Ok'                  // buttonName
        );
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
  });
});


function carregaUsuarios(){
  $.ajax({
    url: 'https://jdc.profrodolfo.com.br/listar.php',
    type: 'post',
    dataType: 'json',
    data: {'listar':1},
    success: function(json){
      
      if(json.status == 1){
        usuarios = json.usuarios;
        listarUsuarios(usuarios);
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
  });
}

$(document).on('change','select#usuario',function(){
  id_usuario = $(this).val();
  prencheForm();
});

$(document).on('click','#editar',function(){
  
  if(id_usuario.length > 0 && id_usuario != ""){
    $("#nome").prop('disabled', false);
    $("#email").prop('disabled', false);
    $("#senha").prop('disabled', false);
  }else{
    alert("Não há registros para serem editados!");
  }
});

$(document).on('click','#cancela',function(){
  desabilitar();
  prencheForm();
});

function desabilitar(){
  $("#nome").prop('disabled', true);
  $("#email").prop('disabled', true);
  $("#senha").prop('disabled', true);
}

function prencheForm(){
  for(var i = 0; i < usuarios.length; i++){
    if(usuarios[i].cd == id_usuario){
      $('#nome').val(usuarios[i]['nome']);
      $('#email').val(usuarios[i]['email']);
      $('#senha').val(usuarios[i]['senha']);
      break;
    }
  }
  
}

$(document).on('click','#atualiza',function(){
  var form = $('#formEdita').serialize();
  form +="&codigo="+ id_usuario;

  $.ajax({
    url: 'https://jdc.profrodolfo.com.br/editar.php',
    method: 'post',
    dataType: 'json',
    data:form,
    success: function(json){
      alert(json.msg);
      if(json.status == 1){
        usuarios[id_usuario]['nome'] = $('#nome').val();
        usuarios[id_usuario]['email'] = $('#email').val();
        $('#opt_'+id_usuario).html($('#nome').val());

        for(var i = 0; i < usuarios.length; i++){
          if(usuarios[i].cd == id_usuario){
            usuarios[i]['nome'] = $('#nome').val();
            usuarios[i]['email'] = $('#email').val();
            $('#senha').val('');
            break;
          }
        }
        desabilitar();
      }
    }
  });
});

$(document).on('click','#btnExcluir',function(){
  if(id_usuario != ""){
    $.ajax({
      url: 'https://jdc.profrodolfo.com.br/excluir.php',
      type: 'post',
      dataType: 'json',
      data:{ excluir: id_usuario},
      success: function(json){
        navigator.notification.alert(
            json.msg,  // message
            false,         // callback
            'Sucesso!',            // title
            'Ok'                  // buttonName
        );
        if(json.status == 1){
          $('#nome').val("");
          $('#email').val("");
          $('#senha').val("");
          carregaUsuarios();
        }
      },
      error: function (xhr, ajaxOptions, thrownError){
        alert(xhr.status);
        alert(thrownError);
      }
    });
  }
});

function listarUsuarios(usuarios){
  $('#lista').html('');
  var lista = "<option value=''>Selecione um usuário1</option>";
  
  for(var i = 0; i < usuarios.length;i++){
    var id = usuarios[i].cd;
    var nome = usuarios[i]['nome'];
    lista += "<option id='opt_"+id+"' value='"+id+"' >";
    lista += nome;
    lista += "</option>";
  }
  $('#usuario').html(lista);
}