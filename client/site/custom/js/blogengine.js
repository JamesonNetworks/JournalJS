'use strict';

var blogEngine = {

	VERSION: 0.1,
	blogPosts: [],
	currentBlogPost: {},

	populateBlogPosts: function() {
		$.ajax({
			url: conf.blogserver + '/list',
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.blogPosts = data;
			$('#' + conf.eventhandler).trigger('BlogListGot');
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
		});
	},

	getBlogPost: function(blog_id) {
		$.ajax({
			url: conf.blogserver + '/' + blog_id,
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			currentBlogPost = data;
			$('#' + conf.eventhandler).trigger('BlogEntryGot');
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEntryError');
		});
	}
}