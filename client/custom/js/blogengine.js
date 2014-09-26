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
	},

	getAboutMe: function() {
		$.ajax({
			url: conf.blogserver + '/about',
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.aboutme = data;
			$('#' + conf.eventhandler).trigger('AboutMeGot');
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
		});
	},

	getResume: function() {
		$.ajax({
			url: conf.blogserver + '/resume',
			cache: false,
			dataType: 'json'
		}).done(function(data, status, jqXHR) {
			blogEngine.resumeMarkUp = data;
			$('#' + conf.eventhandler).trigger('ResumeGot');
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#' + conf.eventhandler).trigger('BlogEngineError');
		});
	},

	getContentForMenu: function() {
		var staticMonths = new Array();
		staticMonths[0] = "January";
		staticMonths[1] = "February";
		staticMonths[2] = "March";
		staticMonths[3] = "April";
		staticMonths[4] = "May";
		staticMonths[5] = "June";
		staticMonths[6] = "July";
		staticMonths[7] = "August";
		staticMonths[8] = "September";
		staticMonths[9] = "October";
		staticMonths[10] = "November";
		staticMonths[11] = "December";
		var currentContent = JSON.parse(JSON.stringify(blogEngine.content.blogPosts));
		var months = _.chain(currentContent)
			.reduce(function(memory, post) {
				if(memory.date) {
					var newMemory = JSON.parse(JSON.stringify(memory));
					var date = new Date(0);
					date.setUTCSeconds(memory.date / 1000);
					var monthYear = staticMonths[date.getMonth()]  + ' - ' + date.getFullYear();
					if(typeof(memory[monthYear]) === 'undefined') {
						memory[monthYear] = [];
					}
					memory[monthYear].push(newMemory);
					delete memory.date;
					delete memory.title;
					delete memory.uuid;
				}
				else {
					var date = new Date(0);
					date.setUTCSeconds(post.date / 1000);
					var monthYear = staticMonths[date.getMonth()]  + ' - ' + date.getFullYear();
					if(typeof(memory[monthYear]) === 'undefined') {
						memory[monthYear] = [];
					}
					memory[monthYear].push(post);
				}
				return memory;
			})
			.map(function(articles, key) {
				return { id:key, articles: articles };
			})
			.value();
		return {months: months};
	}
}