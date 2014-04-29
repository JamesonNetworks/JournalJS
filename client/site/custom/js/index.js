function blogListGot() {
	var template = $('#blog-entry-list-template').html();
	var html = Mustache.to_html(template, blogEngine.content);
	
	$('#sidenav-btn-container').append(html);
}

function blogPostGot() {
	var template = $('#blog-entry-template').html();
	var html = Mustache.to_html(template, blogEngine.content.currentBlogPost);
	$('#blog-entry').empty();
	$('#blog-entry').append(html);
}

// Messaging functions
function showMessage (message, type) {
	var msgcnt = { "message": message, "type": type };
	var template = $('#message_template').html();
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

	var callback = function() {
		$('.article-button').click(blogEntryClick);
	}

	blogEngine.populateBlogPosts(callback);
}

