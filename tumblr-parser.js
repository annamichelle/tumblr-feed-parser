$( function() {
	getPosts();
});	

function getPosts() {
	// Post parser for Tumblr blogs.
	// Change "blog_url" to pull in  a new feed. 

	var blog_name   = 'uwmspeccoll',
	    tumblr_feed = 'http://' + blog_name + '.tumblr.com/api/read/json?callback=?',
		tumblr_address = 'http://' + blog_name + '.tumblr.com';

	$.getJSON(tumblr_feed, function(data) {
		getPosts(data.posts);
	});

	// HELPERS
	function getPosts(json) {
		
		// Limit number of posts shown
		if(json.length>5){
			l = 5;
		}
		else {
			l = json.length;
		}
		for( var i=0; i<l; i++ ) {
			formatPost(json[i]);
		}
		
		// Add a link to your Tumblr at the end of posts
		$('#tumblr-feed').append('<div class="tumblr-footer"><a href="' + tumblr_address +'">Read more posts on Tumblr &#8594;</a></div>');
	}

	function formatPost(post) {
		date    = moment.unix(post['unix-timestamp']).format('MMM Do, YYYY');
		content = post['regular-body'];
		type    = post.type;

		// Format post based on post type
		switch (type)
		{
		// Normal post
		case "regular":
			var postTitle = '';
			if (post['regular-title'] != null) {
				postTitle = '<h3>' + post['regular-title'] + '</h3>';
			}
			content = postTitle + post['regular-body'];
			icon    = 'icon-align-left';
			break;

		// Link post
		case "link":
			content = '<span class="link-text"><a href="' + post['link-url'] + 
			          '">' + post['link-text'] + '</a></span>' +
			          '<span class="link-description"> ' + post['link-description'] + '</span>';
			icon    = 'icon-link';
			break;

		// Video post
		case "video":
			content = '<div class="video-container">' + post['video-player-500'] + '</div><span class="video-caption">' + post['video-caption'] + '</span>';
			icon    = 'icon-film';
			break;

		// Photo post
		case "photo":
			content = '<div class="photo"><a href="' + post['url'] + '"><img src="' + post['photo-url-1280'] + 
			          '" alt=""></a></div>' +
			          '<span class="photo-caption">' + post['photo-caption'] + '</span>';
			icon    = 'icon-picture';
			break;

		case "quote":
			content = '<blockquote>' + post['quote-text'] + '</blockquote>';
			icon    = 'icon-quote-right';
			break;

		case "audio":
			content = post['audio-player'] + '<span class="song-caption">' + post['audio-caption'] + '</span>';
			icon    = 'icon-music';
			break;
			
		case "conversation":
			var postTitle = '';
			if (post['conversation-title'] != null) {
				postTitle = '<h3>' + post['conversation-title'] + '</h3>';
			}
			content = postTitle + post['conversation-text'];
			icon = 'icon-quote-right';
			break;
		}

		// Send it to the view
		$('#tumblr-feed').append('<div class="post"><span class="post-date"><a href="' + post['url'] + '">' + date + '</a></span><div class="content">' + content + '</div></div>');
	}
	
	// Set target of all links to _top (to open them outside of iFrame)
	$('#tumblr-feed a').attr('target', '_top');
	
}