function blogListGot() {
	var template = $('#menu-template').html();
	var html = Mustache.to_html(template, blogEngine.content);
	$('#menu-placeholder').append(html);
	$('.article-link').click(blogEntryClick);
	$('#menuEntryList').hide();

    $('#menuHoverToggle').hover(
		function(){
			$('#menuEntryList').stop().slideDown('slow');
		},
		function(){
			setTimeout(function() {
				$('#menuEntryList').stop().slideUp('slow');   
			}, 4000);
		}
    );
}

function buildBlogPostHtml(post) {
	finalHtml = '';

	// Get the templates
	var template = $('#blog-entry-template').html();
	var sectionHeaderTemplate = $('#section-header').html();
	var sectionContentParagraphTemplate= $('#section-content-paragraph').html();
	var sectionContentCodeTemplate = $('#section-content-code').html();
	var sectionContentQuoteTemplate = $('#section-content-quote').html();

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
				case 'picture':
					finalHtml += Mustache.to_html(sectionContentQuoteTemplate, content);
					break;
				default:
			}
		}
	}

	return finalHtml;
}

function blogPostGot() {
	var template = $('#blog-entry-template').html();
	var html = buildBlogPostHtml(blogEngine.content.currentBlogPost);

	$('#blog-entry').fadeOut(function() {
		$('#blog-entry').empty();
		$('#blog-entry').append(html);
		$('.article-link').removeClass('active');
		$('#' + blogEngine.content.currentBlogPost.date).addClass('active');
		$('#blog-entry').fadeIn();
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
	blogEngine.getBlogPost(this.id + '.json');
}

window.onload = function() {
	$('#' + blogEngine.EventHandler).on('BlogListGot', blogListGot);
	$('#' + blogEngine.EventHandler).on('BlogPostGot', blogPostGot);
	$('#' + blogEngine.EventHandler).on('BlogEngineError', blogEngineError);

	$('#blog-entry').hide();
	blogEngine.populateBlogPosts();
}

