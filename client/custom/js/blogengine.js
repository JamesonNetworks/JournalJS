'use strict';

var blogEngine = {

	VERSION: 0.1,
	content : {
		blogPosts: [],
		currentBlogPost: {}
	},
	EventHandler: conf.eventhandler,

	populateBlogPosts: function(key) {
		$.ajax({
			url: conf.blogserver + '/list',
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.content.blogPosts = data;
			$('#' + conf.eventhandler).trigger('BlogListGot');
			blogEngine.getBlogPost(key === null ? data[0].date : key);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
		});
	},

	getBlogPost: function(blog_id) {
		$.ajax({
			url: conf.blogserver + '/entries/' + blog_id,
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.content.currentBlogPost = data;
			$('#' + conf.eventhandler).trigger('BlogPostGot');
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
		});
	}
}