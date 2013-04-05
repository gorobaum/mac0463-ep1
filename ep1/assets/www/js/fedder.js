var fedder = {

	checkConnection: function() {
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			return false;
		}
		return true;
	},

	loadFeeds: function() {
		if (fedder.checkConnection) {
			fedder.updateFeeds();
			fedder.removeFeedsOnHtml();
			fedder.putFeedsOnHtml();
		}
	},

	updateFeeds: function() {
		var feed = new google.feeds.Feed(feedURL);
		feed.includeHistoricalEntries();
		feed.setNumEntries(10);

		feed.load(function(result) {
			if (!result.error) {
				for (var i = 0; i < result.feed.entries.length; i++) {
					var entradaDoFeed = result.feed.entries[i];
					var dataPublicacao = entradaDoFeed.publishedDate;
					fedder.store.findByTitle(entradaDoFeed, 
						function(entradaDoFeed, taNoBanco) {
							if (!taNoBanco) {
								fedder.store.addNewFeed(feedURL, entradaDoFeed);
							}
						}
					);
				}
			}
		});
	},

	removeFeedsOnHtml: function() {
		var myNode = document.getElementById("table-feed");
		myNode.innerHTML = '';
	},

	putFeedsOnHtml: function() {
		fedder.store.findByFeedURL(feedURL, function(result) {
			$("ul").append('<li data-role="divider" data-theme="b">'+result[0].feedURL+'<span class="ui-li-count">'+result.length+'</span></li>');
			console.log(result);
			for (var i = 0; i < result.length; i++) {
				var entradaDoFeed = result[i];
				var dataPublicacao = entradaDoFeed.publishedDate;
				$("ul").append('<li><a href="'+entradaDoFeed.link+'"><h2>'+entradaDoFeed.title+'</h2><p>'+entradaDoFeed.contentSnippet+'</p><p class="ui-li-aside"><strong>Publicação: '+dataPublicacao.substring(0, dataPublicacao.length - 7)+'</strong>PM</p></a></li>');
			}
			$('ul').listview('refresh');
		});
	},

	initialize: function() {
		this.store = new Storage();
		google.load("feeds", "1");
		google.setOnLoadCallback(fedder.updateFeeds);
	}
};

app.initialize();
var feedURL = "http://www.imprensa.usp.br/?feed=rss2";
fedder.initialize();
window.setInterval(fedder.loadFeeds,30000);