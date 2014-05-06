function blogListGot() {
	var template = $('#menu-template').html();
	var html = Mustache.to_html(template, blogEngine.content);
	$('#menu-placeholder').append(html);
	$('.article-link').click(blogEntryClick);
	$('#menuEntryList').hide();

    $('#menu').hover(
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

function blogPostGot() {
	var template = $('#blog-entry-template').html();
	var html = Mustache.to_html(template, blogEngine.content.currentBlogPost);
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

