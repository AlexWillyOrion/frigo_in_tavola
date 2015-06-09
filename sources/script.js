
var site = "http://www.frigointavola.eu/";
var ingr = new Array();
var loggato = 1;
var social = '<div class="social-box scrollable">\
<h2>Condividi</h2>\
<a target="_blank" href="fb://profile/785948414845430"><img src="social/128-facebook.png"/></a>\
<a target="_blank" href="twitter://user?id=2730655360"><img src="social/128-twitter.png"/></a>\
<a target="_blank" href="https://plus.google.com/u/0/+AlexMannoWilly/"><img src="social/128-googleplus.png"/></a>\
<a target="_blank" href="instagram://tag?name=frigointavola"><img src="social/128-instagram.png"/></a>\
</div>';
var comments = '<div class="comment-box scrollable">\
<h2>Commenta</h2>\
<input type="text" name="nome" placeholder="Username"/><textarea placeholder="Commento"></textarea>\
<div class="commenta">Commenta</div>\
</div>';

comments = ''; // DA TOGLIERE

var luser;



var old = "ingredienti";
var lingua;



var lingua_it = new Array();
var lingua_en = new Array();
var lingua_fr = new Array();
var lingua_es = new Array();
var lingua_de = new Array();


lingua_it[0] = "MODIFICA";
lingua_en[0] = "EDIT";

lingua_it[1] = "Salva";
lingua_en[1] = "Save";

lingua_it[2] = "INGREDIENTI";
lingua_en[2] = "INGREDIENTS";

lingua_it[3] = "Accedi";
lingua_en[3] = "Login";

lingua_it[4] = "VEDI RICETTE";
lingua_en[4] = "VIEW RECIPES";

lingua_it[5] = "CATEGORIE";
lingua_en[5] = "CATEGORY";


lingua = lingua_it;

var upload = $('<form action="'+site+'content.php" method="post" enctype="multipart/form-data" > <input type="file" name="imagefilename" accept="image/x-png, image/gif, image/jpeg" /></form>');

function splash_start()
{
	$('#splash').show();
}

function splash_stop()
{
	$('#splash').hide();
}

function load()
{
	$('#loader').show();
}
function unload()
{
	$('#loader').hide();
}

function profilo()
{
	$('li[data-cont="profilo"]').addClass('sel');
	var content = '<div id="profilo_tab">\
	<div class="foto_tab" style="background-image:url(\''+luser.foto+'\')"><div class="modifica">'+lingua[0]+'</div></div>\
	<input name="nome" type="text" placeholder="Mario Rossi" value="'+luser.nome+'">\
	<input name="email" type="email" placeholder="mariorossi@gmail.com" value="'+luser.user+'">\
	<input name="id" type="hidden" value="'+luser.id+'">\
	<div id="salva">'+lingua[1]+'</div>\
	</div>';
	$('#content').html(content);
}

function preferiti()
{
	
}

function categorie()
{
	$('#content').fadeOut();
	$('li').removeClass('sel');
	$('li[data-cont="categorie"]').addClass('sel');
	$('.ingr').remove();
	$.ajax({
		url: site+"content.php",
		type: "POST",
		data:{
			op: "get_ric_cat"
		},
		success: function(msg){
		
			var json = $.parseJSON(msg);
			load();
			$('#content').empty().append('<h1>'+lingua[5]+'</h1>');
			$('#content').append('<div class="get_ingr"></div>').find('.get_ingr').text('<');
			$('#content').find('h1').css('margin-bottom','-30px');
			$('#content').find('.get_ric').text('<').addClass('get_ingr').removeClass('get_ric');
			$('#content').find('.categoria').remove();
			$.each(json, function(k,v){
		
				$('#content').append('<div data-id="'+v.id+'" class="categoria scrollable">'+v.cat+' ('+v.n+')</div>');
				
			});
			unload();
			$('#content').fadeIn();
		}
	});
}

function carica_login()
{
	$('li[data-cont="logga"]').addClass('sel');
	var content = '<div id="login">\
	<input name="user" type="email" placeholder="Username">\
	<input name="pass" type="password" placeholder="Password">\
	<div id="accedi">'+lingua[3]+'</div>\
	</div>';
	$('#content').html(content);
}

function esci()
{
	$('#profilo').addClass('close');
	carica_ingredienti();
	$('li[data-cont="ingredienti"]').addClass('sel');
	loggato = 0;
	
	$('li[data-cont="esci"]').hide();
	$('li[data-cont="preferiti"]').hide();
	$('li[data-cont="profilo"]').hide();
	
	$('li[data-cont="logga"]').show();
}


function carica_ingredienti()
{
	$('li').removeClass('sel');
	$('li[data-cont="ingredienti"]').addClass('sel');
	
	$('#content').fadeOut(function(){
		$.ajax({
			url: site+"content.php",
			type: "POST",
			data:{
				op: "get_ingr"
			}
		}).done(function(msg){
			
			if(msg.length>0)
				msg='<div class="scrollable"><h1 style="padding:0;">'+lingua[2]+'</h1>'+
					msg+
					'<div class="clear"></div>'+
					'<div class="get_ric">'+lingua[4]+'</div></div>';
			$('#content').html(msg);
			$('#content').fadeIn();
			
		});
	});
	
}
function carica_ricette(ingr_o,callback)
{
	if(ingr_o == 0)
	{
		ingr = new Array();
		
		$('.ingr.sel').each(function(){
			ingr.push($(this).data('id'));
		});
	}
	$.ajax({
		url: site+"content.php",
		type: "POST",
		data:{
			op: "get_ric",
			dati: JSON.stringify(ingr)
		},
		success: callback
	});
}
function share_fb()
{
	$('#fb-share').click();
}
function stampa_ricette(dati)
{
	$.each(dati, function(k,v){
		
		$('#content').append('<div data-id="'+v.id+'" class="ricetta scrollable">'+v.titolo+'</div>');
		
	});
}

function view_ric(_id,callback)
{
	$.ajax({
		url: site+"content.php",
		type: "POST",
		data:{
			op: "view_ric",
			id: _id
		},
		success: callback
	});
}

function view_ric_by_cat(_id,callback)
{
	$.ajax({
		url: site+"content.php",
		type: "POST",
		data:{
			op: "get_ric_by_cat",
			id: _id
		},
		success: callback
	});
}

function disable_scroll()
{
	var selScrollable = '.scrollable';
	// Uses document because document will be topmost level in bubbling
	$(document).on('touchmove',function(e){
	  e.preventDefault();
	});
	// Uses body because jQuery on events are called off of the element they are
	// added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart', selScrollable, function(e) {
	  if (e.currentTarget.scrollTop === 0) {
	    e.currentTarget.scrollTop = 1;
	  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
	    e.currentTarget.scrollTop -= 1;
	  }
	});
	// Stops preventDefault from being called on document if it sees a scrollable div
	$('body').on('touchmove', selScrollable, function(e) {
	  e.stopPropagation();
	});
}

/*
window.addEventListener("resize", function() {
    // Get screen size (inner/outerWidth, inner/outerHeight)
    var height = $(window).height();
    var width = $(window).width();

    if(width>height) {
     
	    $("#mode").show();
	    $('#content').hide();
	    $('#header').hide();
    } else {
      // Portrait
      $("#mode").hide();
      $('#header').fadeIn();
      $('#content').fadeIn();
    }
}, false);
*/

function check_login()
{
	
	if($.parseJSON(window.localStorage.getItem("luser")) != null)
	{
		luser = window.localStorage.getItem("luser");
		json = luser;
		$('#profilo .nome').text(json.nome);
		$('#profilo .foto').css('background-image','url("'+json.foto+'")');
		$('#profilo').removeClass('close');
		$('li[data-cont="ingredienti"]').addClass('sel');
		
		$('li[data-cont="logga"]').hide();
		
		$('li[data-cont="esci"]').show();
		$('li[data-cont="preferiti"]').show();
		$('li[data-cont="profilo"]').show();
	}
	else
	{
		$.ajax({
			type:"POST",
			url: site+"content.php",
			data:{
				op: "check_login"
			}
		}).done(function(msg){
			if(msg!="error")
			{
				var json = $.parseJSON(msg);
				luser = json;
				window.localStorage.setItem("luser",JSON.stringify(luser))
				$('#profilo .nome').text(json.nome);
				$('#profilo .foto').css('background-image','url("'+json.foto+'")');
				$('#profilo').removeClass('close');
				$('li[data-cont="ingredienti"]').addClass('sel');
				
				$('li[data-cont="logga"]').hide();
				
				$('li[data-cont="esci"]').show();
				$('li[data-cont="preferiti"]').show();
				$('li[data-cont="profilo"]').show();
			}else
			{
				$('#profilo').addClass('close');
				$('li[data-cont="logga"]').show();
				
				$('li[data-cont="ingredienti"]').addClass('sel');
				
				$('li[data-cont="esci"]').hide();
				$('li[data-cont="preferiti"]').hide();
				$('li[data-cont="profilo"]').hide();
			}
			
		});
	}
}

$(function(){

	
  // Bind the swipeleftHandler callback function to the swipe event on div.box

  	check_login();
	carica_ingredienti();
	disable_scroll();
	
	setTimeout(splash_stop, 2000);
	
	$("#content").delegate(".ingr", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		$(this).toggleClass( "sel" );
		var temp = $(this).css('background-image');
		$(this).css('background-image',$(this).data('icon'));
		$(this).data('icon',temp);
	});
	
	
	
	$("#menu").delegate("li", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		
		$('#menu > li').removeClass('sel');
		
		var sele = 1;
		
		var voce = $(this).data('cont');
		
		if(voce!="lingua")
			old = voce;
		/*
	
		if(voce == "lingua")
		{
			if(lingua == lingua_en)
				lingua = lingua_it;
			else
				lingua = lingua_en;
			
			voce = old;
		}
		
		*/
		$('#menu').removeClass('sel');
		if(voce == "lingua")
		{
			$('li[data-cont="lingua"]').find('.icon-down').toggleClass('op');
			$('.tend_ling').toggleClass('op');
			
			sele = 0;
		}
		
		if(voce=="esci")
		{
			esci();
		}
		else if(voce == "logga")
		{
			carica_login();
		}
		else if(voce == "profilo")
		{
			
			profilo();
		}
		else if(voce == "preferiti")
		{
			preferiti();
		}
		else if(voce == "categorie")
		{
			categorie();
			
			
		}
		else
		{
			
			if(voce=="ingredienti")
				carica_ingredienti();
		}
		
			
	});
	$("#content").delegate(".get_ingr", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		$("#content").fadeOut(function(){
			load();
			carica_ingredienti();
			setTimeout(function(){
				unload();
				$("#content").fadeIn();
				
			}, 700);
		});
	});
	
	$("body").delegate(".btn-menu", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		$('#menu').toggleClass('sel');
	});
	$("body").on("focus", "input", function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).removeClass('error');
	});
	$("#content").delegate("#accedi", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		$('#login input').blur();
		var user = $('#login [name="user"]').val();
		var pass = $('#login [name="pass"]').val();
		$.ajax({
			type:"POST",
			url: site+"content.php",
			data:{
				op: "login",
				u: user,
				p: pass
			}
		}).done(function(msg){
			if(msg!="error")
			{
				var json = $.parseJSON(msg);
				luser = json;
				$('#profilo .nome').text(json.nome);
				$('#profilo .foto').css('background-image','url("'+json.foto+'")');
				$('#profilo').removeClass('close');
				carica_ingredienti();
				$('li[data-cont="ingredienti"]').addClass('sel');
				
				$('li[data-cont="logga"]').hide();
				
				$('li[data-cont="esci"]').show();
				$('li[data-cont="preferiti"]').show();
				$('li[data-cont="profilo"]').show();
			}else
			{
				alert("error");
				$('#login input').val("").addClass('error');
			}
			
		});
	});
	$("#content").delegate("#salva", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		load();
		           
	    $.ajax({
                url: site+'content.php', 
                cache: false,
                data: {
                	op: 'update_profile',
                	id:  $('input[name="id"]').val(),
	                foto:  $('.foto_tab').css("background-image"),
	                nome:  $('input[name="nome"]').val(),
	                email: $('input[name="email"]').val()
                },                         
                type: 'post',
                success: function(msg){
                    setTimeout(function(){
	                    unload();
	                    check_login();
	                    carica_ingredienti();
	                    $('li[data-cont = "profilo"]').removeClass('sel');
                    }, 1000);
                }
	     });
	     
	});
	
	$("#content").delegate(".modifica", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		upload.find('input').click();
		upload.find('input').change(function(){
			input = this;
		    if ( input.files && input.files[0] ) {
		        var FR= new FileReader();
		        FR.onload = function(e) {
		             //$('#img').attr( "src", e.target.result );
		             $('.foto_tab').css("background-image", 'url("'+e.target.result+'")');
		            console.log( e.target.result );
		        };       
		        FR.readAsDataURL( input.files[0] );
		    }
		});
			/*
var data = new FormData(upload);
			data.append("boh","bobo");
			$.ajax({
			    url: site+'content.php',
			    data: data,
			    cache: false,
			    contentType: false,
			    processData: false,
			    type: 'POST',
			    success: function(data){
			        console.log(data);
			    }
			});

			
		});*/
		



	});
	
	$("body").delegate(".zoom", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).fadeOut(function(){
			$(this).remove();
		});
	});
	
	
	
	
	var tapped=false
	$("#content").delegate(".desc img", "touchstart",function(e){
	
		
	
	    if(!tapped){ 
	      	tapped=setTimeout(function(){
	        	tapped=null
	          //SINGLE
	        },300);  
	    } else {    
	      	clearTimeout(tapped); 
	      	tapped=null
	      	
	      	e.stopPropagation();
	      	e.preventDefault();
			var src = $(this).attr('src');
			var zoom = '<div style="background-image: url(\''+src+'\');" class="zoom"></div>';
			$('body').append(zoom);
			$('.zoom').fadeIn();
	    }
	    e.preventDefault()
	});
	
	$("#content").delegate(".categoria", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var _id = $(this).data('id');
		$("#content").fadeOut(function(){
			load();
			view_ric_by_cat(_id,function(dati){				
				
				dati = $.parseJSON(dati);
				
				$('.categoria').remove();
				
				$.each(dati, function(k,v){
		
					$('#content').append('<div data-id="'+v.id+'" class="ricetta scrollable">'+v.titolo+'</div>');
					
				});
				
				setTimeout(function(){
					unload();
					$("#content").fadeIn();
					
				}, 1000);
			});
		});
	});
	
	$("#content").delegate(".ricetta", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var _id = $(this).data('id');
		$("#content").fadeOut(function(){
			load();
			view_ric(_id,function(dati){
			
				dati = $.parseJSON(dati);
				
				
				$('#content').empty();
				
				
				$('#content').append('<h3 style="margin-bottom:-30px;">Categoria: '+dati.categoria+'</h3>');
				$('#content').append('<div class="get_ingr"></div>').find('.get_ingr').text('<');
				$('#content').append('<h2 style="margin-top:-40px;">'+dati.titolo+'</h2>');
				$('#content').append('<div class="scrollable desc">'+dati.descrizione+'</div>');
				
				$('#content').append(social);
				$('#content').append(comments);
				setTimeout(function(){
					unload();
					$("#content").fadeIn();
					
				}, 1000);
			});
		});
	});
	
	$("#content").delegate(".get_ric", "tap", function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		$("#content").fadeOut(function(){
			load();
			$('#content').find('h1').text('RICETTE').css('margin-bottom','-30px');
			$('#content').find('.get_ric').text('<').addClass('get_ingr').removeClass('get_ric');
			carica_ricette(0,function(dati){
				$("#content").find('.ingr').remove();
				if(dati != "null")
					stampa_ricette($.parseJSON(dati));
				else
					$("#content").append('<h3>Nessuna ricetta trovata con questi ingredienti.<br/>Prova a scegliere altri ingredienti.</h3>');
				
				
				
				setTimeout(function(){
					unload();
					$("#content").fadeIn();
					
				}, 600);
				
			});
		});
	});
	
	
});