/*
 * This file is made for Onepage
*/

// -----------------------------------------------------  LOADING
window.onload=function() {
    document.getElementById('loading-mask').style.display='none';
}

$(function() {
	$(' #project-list > li ').each( function() { 
		$(this).hoverdir({
			hoverDelay : 75
		}); 
	});
});		

jQuery(document).ready(function(){
	
// -----------------------------------------------------  PROGRESS BAR & PORTFOLIO
	$('.percent p').fadeOut(400);
	$('.project-title').fadeOut(400);
	jQuery(window).scroll(function() {
		jQuery('.progress:in-viewport').each(function(e){
			var progressBar = jQuery(this),
			progressValue = progressBar.find('.percent').attr('data-value');
			if (!progressBar.hasClass('animated')) {
				progressBar.addClass('animated');
				progressBar.find('.percent').delay(300).animate({
					width: progressValue + "%"
				}, 1200, function() {
					progressBar.find('.percent p').fadeIn(400);
				});
			}
		});
		
		jQuery('.project-list li:in-viewport').each(function(e){
			var portfolioBar = jQuery(this);
			if (!portfolioBar.hasClass('animated')) {
				portfolioBar.find('img').delay(300).animate({height: "123px"}, 1000, 'easeInOutQuart', function() {
					portfolioBar.find('.project-title').fadeIn(400);
				});
			}
		});
	});
	

// -----------------------------------------------------  SCROLL TO TOP
	$("a[href='#top']").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});

// -----------------------------------------------------  DEVICE MENU TOGGLE
	jQuery('.menu-toggle a').click(function(e){
		e.preventDefault();
		jQuery('.menu-device').stop().slideToggle(500);
	})

// -----------------------------------------------------  PARALLAX	
	$('.bg1').parallax("50%", 0.5);
	$('.bg2').parallax("50%", 0.5);
	$('.bg3').parallax("50%", 0.5);
	$('.bg4').parallax("50%", 0.5);
	
// -----------------------------------------------------  FANCYBOX	
	$('.fancybox').fancybox();
	
// -----------------------------------------------------  FLEXSLIDER
	jQuery('.flexslider').flexslider({
		animation: 'fade',
		controlNav: false,
		slideshowSpeed: 4000,
		animationDuration: 300
	});
// -----------------------------------------------------  PROJECT ISOTOPE
	// Needed variables
	var $container	 	= $("#project-list");
	var $filter 		= $("#project-filter");
		
	// Run Isotope  
	$container.isotope({
		filter				: '*',
		layoutMode   		: 'masonry',
		animationOptions	: {
		duration			: 750,
		easing				: 'linear'
	   }
	});	
	
	// Isotope Filter 
	$filter.find('a').click(function(){
	  var selector = $(this).attr('data-filter');
		$container.isotope({ 
		filter				: selector,
		animationOptions	: {
		duration			: 750,
		easing				: 'linear',
		queue				: false,
	   }
	  });
	  return false;
	});	
	
	// Copy categories to item classes
	$filter.find('a').click(function() {
		var currentOption = $(this).attr('data-filter');
		$filter.find('a').removeClass('current');
		$(this).addClass('current');
	});

// -----------------------------------------------------  NICE SCROLL
	
	$("html").niceScroll({cursorborder:"",cursorcolor:"#FF3300"});
	
	
	
// -----------------------------------------------------  PAGE SCROLL	
	$('ul.menu li a').bind('click',function(event){
		$('ul.menu li a').removeClass("current");
		$(this).addClass("current");
		var $anchor = $(this);
	
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top - 60
		}, 1500,'easeInOutQuart');
		event.preventDefault();
	});
	
	$('.menu-device ul li a').bind('click',function(event){
		var $anchor = $(this);
		jQuery('.menu-device').stop().slideToggle(500);
	
		$('html, body').stop().animate({
			scrollTop: $($anchor.attr('href')).offset().top - 60
		}, 1500,'easeInOutQuart');
		event.preventDefault();
	});
	
	
});

	



	

// ----------------------------------------------------  CONTACT FORM
function submitForm(){
	$.post('plugin/sendmail.php',$('#contactForm').serialize(), function(msg) {
		$(".alertMessage").html(msg);
	});
	// Hide previous response text
	$(msg).remove();
	// Show response message
	contactform.prepend(msg);
}	

// -----------------------------------------------------  GOOGLE MAP		
/*jQuery(document).ready(function(){ 
	var myLatlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
	  center: myLatlng,
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"),  myOptions);
	var marker = new google.maps.Marker({
	  position: myLatlng,
	  map: map,
	  title:"Click Me for more info!"
	});
	
	var infowindow = new google.maps.InfoWindow({});
	
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("Write here some description"); //sets the content of your global infowindow to string "Tests: "
		infowindow.open(map,marker); //then opens the infowindow at the marker
	});
	marker.setMap(map);
});*/

