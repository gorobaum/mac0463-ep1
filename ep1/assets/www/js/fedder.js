var fedder = {

	loadFeeds: function() {
		var feed = new google.feeds.Feed("http://www.imprensa.usp.br/?feed=rss2");
		feed.includeHistoricalEntries();
		feed.setNumEntries(10);

		feed.load(function(result) {
			if (!result.error) {
				$("ul").append('<li data-role="divider" data-theme="b">'+result.feed.title+'<span class="ui-li-count">'+result.feed.entries.length+'</span></li>');
				console.log(result.feed);
				for (var i = 0; i < result.feed.entries.length; i++) {
					var entradaDoFeed = result.feed.entries[i];
					var dataPublicacao = entradaDoFeed.publishedDate;
					$("ul").append('<li><a href="'+entradaDoFeed.link+'"><h2>'+entradaDoFeed.title+'</h2><p>'+entradaDoFeed.contentSnippet+'</p><p class="ui-li-aside"><strong>Publicação: '+dataPublicacao.substring(0, dataPublicacao.length - 7)+'</strong>PM</p></a></li>');
				}
			}
			$('ul').listview('refresh');
		});
	},

	initialize: function() {
		google.load("feeds", "1");
		google.setOnLoadCallback(fedder.loadFeeds);
	}
};

fedder.initialize();