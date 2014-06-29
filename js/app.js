var $body;

$( document ).ready(function() {

	$body = $('#container');

	$('article').stacker();

	$('article').on('click', function(){
		$body.attr('class','slide-2')
	});

	$('.front-face').on('click', function(){
		$body.attr('class','slide-1')
	});
	
});