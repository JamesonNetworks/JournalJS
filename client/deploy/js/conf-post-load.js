function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function findBootstrapEnvironment() {
    var envs = ['xs', 'sm', 'md', 'lg'];

    $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-'+env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env;
        }
    };
}

function blogListGot() {
	var template = $('#menu-template').html(); 
	var html = Mustache.to_html(template, blogEngine.content);
	$('#modalContainer').append(html);

	template = $('#sidebar-template').html();
	html = Mustache.to_html(template, blogEngine.getContentForMenu());
	$('#sidebar').append(html);
	$('#sidebar').height($(window).height);
	$('.article-link').click(blogEntryClick);
	$('.sidebar-article-link').click(blogEntryClick);
}

function buildBlogPostHtml(post) {
	finalHtml = '';

	// Get the templates
	var template = $('#blog-entry-template').html();
	var sectionHeaderTemplate = $('#section-header').html();
	var sectionContentParagraphTemplate= $('#section-content-paragraph').html();
	var sectionContentCodeTemplate = $('#section-content-code').html();
	var sectionContentQuoteTemplate = $('#section-content-quote').html();
	var sectionContentPictureTemplate = $('#section-content-picture').html();

	// Build a header object and start rendering the article
	headerObject = {};
	headerObject.title = post.title;
	headerObject.subtitle = post.subtitle

	finalHtml = Mustache.to_html(template, headerObject);

	// Iterate through the markdown and add sections as appropriate

	sections = post.markdown.sections;

	for(var i = 0; i < sections.length; i++) {
		var section = sections[i];
		finalHtml += Mustache.to_html(sectionHeaderTemplate, section);
		for(var k = 0; k < section.contents.length; k++) {
			var content = section.contents[k];
			switch(content.type) {
				case 'paragraph':
					finalHtml += Mustache.to_html(sectionContentParagraphTemplate, content);
					break;
				case 'code':
					finalHtml += Mustache.to_html(sectionContentCodeTemplate, content);
					break;
				case 'quote':
					finalHtml += Mustache.to_html(sectionContentQuoteTemplate, content);
					break;
				case 'picture':
					var picture = {};
					picture.url = conf.blogserver + '/entries/pictures/' + post.date + '_' + content.id + '.' + content.fileType;
					picture.alttext = content.altText;
					finalHtml += Mustache.to_html(sectionContentPictureTemplate, picture);
					break;
				default:
			}
		}
	}
	return finalHtml;
}

function buildAboutMe() {

}

function buildResume() {

}

function blogPostGot() {
	ga('send', 'pageview');	

	window.document.title = blogEngine.content.currentBlogPost.title;
	var html = buildBlogPostHtml(blogEngine.content.currentBlogPost);

	$('#blog-entry').fadeOut(function() {
		$('#blog-entry').empty();
		$('#blog-entry').append(html);
		prettyPrint();
		$('.post-content').linkify();
		$('.article-link').removeClass('active');
		$('.sidebar-article-link').removeClass('active');
		$('.' + blogEngine.content.currentBlogPost.date).addClass('active');
		$('#blog-entry').fadeIn();
		$('.window').fadeOut(function() {
			$('#mask').fadeOut();
			$('#modalContainer').trigger('hideModal', {});
		});
	});
}

function resumeGot() {
	ga('send', 'pageview');	
	window.document.title = 'Resume';
	var html = buildResume(blogEngine.resume);

	$('#blog-entry').fadeOut(function() {
		$('#blog-entry').empty();
		$('#blog-entry').append(html);
		prettyPrint();
		$('.post-content').linkify();
		$('.article-link').removeClass('active');

		$('#blog-entry').fadeIn();
		$('.window').fadeOut(function() {
			$('#mask').fadeOut();
			//$('#modalContainer').trigger('hideModal', {});
		});
	});
}

// Messaging functions
function showMessage (message, type) {
	var msgcnt = { "message": message, "type": type };
	var template = $('#message-template').html();
	var html = Mustache.to_html(template, msgcnt);
	$('#messages').slideUp(function() {
		$('#messages').empty();
		$('#messages').append(html);
		$('#messages').slideDown();
		$('#messages').bind('closed.bs.alert', function () {
			$('#messages').slideUp();
		});
	});
}

// Messages
function showSuccessMessage(message) {
	showMessage(message, 'success');
}

function showInfoMessage(message) {
	showMessage(message, 'info');
}

function showWarningMessage(message) {
	showMessage(message, 'warning');
}

function showDangerMessage(message) {
	showMessage(message, 'danger');
}

function blogEngineError() {
	showDangerMessage('An error has occured');
}

function blogEntryClick(event) {
	blogEngine.getBlogPost(this.id);
	$('#menuOnMobile').empty();
}

function aboutMeClick(event) {
	blogEngine.getAboutMe();
}

function resumeClick(event) {
	//blogEngine.getResume();
	window.location.href = '/resume';
}

window.onload = function() {
	$('#' + blogEngine.EventHandler).on('BlogListGot', blogListGot);
	$('#' + blogEngine.EventHandler).on('BlogPostGot', blogPostGot);
	$('#' + blogEngine.EventHandler).on('BlogEngineError', blogEngineError);
	$('#' + blogEngine.EventHandler).on('ResumeGot', resumeGot);

	$('#blog-entry').hide();
	var key = getParameterByName('entryId');
	blogEngine.populateBlogPosts(key);
}

function showArticlesModal(event) {
	//Cancel the link behavior
	event.preventDefault();
	
	var env = findBootstrapEnvironment();

	switch(env) {
		case 'lg':
		case 'md':
			var id = '#dialog';
		
			//Get the screen height and width
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();
		
			//Set heigth and width to mask to fill up the whole screen
			$('#mask').css({'width':maskWidth,'height':maskHeight});
			
			//transition effect		
			$('#mask').fadeIn(1000);	
			$('#mask').fadeTo("slow",0.8);	
		
			//Get the window height and width
			var winH = $(window).height();
			var winW = $(window).width();
	              
			//Set the popup window to center
			$(id).css('top',  winH/2-$(id).height()/2);
			$(id).css('left', winW/2-$(id).width()/2);
		
			//transition effect
			$(id).fadeIn(2000); 
			$('#modalContainer').trigger('showModal', {});
			break;
		case 'sm':
		case 'xs':
			var menuCopy = $('#menuEntryList').clone();
			$('#blog-entry').fadeOut(function() {
				var menuCopy = $('#menuEntryList').clone();
				$('#menuOnMobile').append(menuCopy);
				$('.article-link').click(blogEntryClick);
			});
			break;
		default:
		break;
	}
}

$(document).ready(function() {	
	var template = $('#brand-template').html();
	var html = Mustache.to_html(template, conf);
	$('#brandLocation').append(html);

	// Attaching to the displaying of modal to block scrolling
	$('#modalContainer').on('showModal', function () {
		$('body').addClass('modal-open');
	}).on('hideModal', function () {
		$('body').removeClass('modal-open');
	});

	// Wire up buttons
	$('#articles').click(showArticlesModal);
	$('#articles2').click(showArticlesModal);
	$('#about').click(aboutMeClick);
	$('#resume').click(resumeClick);
	
	$('.body').append(resumeClick);

	//if close button is clicked
	$('.window .close').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		
		$('.window').fadeOut(function() {
			$('#mask').fadeOut();
			$('#modalContainer').trigger('hideModal', {});
		});	

	});		
	
	//if mask is clicked
	$('#mask').click(function () {
		$('.window').fadeOut(function() {
			$('#mask').fadeOut();
			$('#modalContainer').trigger('hideModal', {});
		});
	});			

	$(window).resize(function () {
	 
 		var box = $('#modalContainer .window');
 
        //Get the screen height and width
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
      
        //Set height and width to mask to fill up the whole screen
        $('#mask').css({'width':maskWidth,'height':maskHeight});
               
        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();

        //Set the popup window to center
        box.css('top',  winH/2 - box.height()/2);
        box.css('left', winW/2 - box.width()/2);
	 
	});


});


