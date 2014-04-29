'use strict';

var blogEngine = {

	VERSION: 0.1,
	content : {
		blogPosts: [],
		currentBlogPost: {}
	},
	EventHandler: conf.eventhandler,

	populateBlogPosts: function(callback) {
		$.ajax({
			url: conf.blogserver + '/list',
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.content.blogPosts = data;
			$('#' + conf.eventhandler).trigger('BlogListGot');
			blogEngine.getBlogPost(data[0].date + '.json');
			callback();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
			callback();
		});
	},

	getBlogPost: function(blog_id) {
		$.ajax({
			url: conf.blogserver + '/' + blog_id,
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