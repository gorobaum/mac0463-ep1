var feeder = {

	checkConnection: function() {
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			return false;
		}
		return true;
	},

	loadMoreFeeds: function() {
		feedsPuxados += 10;
		this.updateFeeds();
	},

	loadFeeds: function() {
		feeder.updateFeeds();
	},

	updateFeeds: function() {
		var feed = new google.feeds.Feed(feedURL);
		feed.includeHistoricalEntries();
		feed.setNumEntries(feedsPuxados);
		feed.load(function(result) {
			if (!result.error) {
				tituloDoFeed = result.feed.title;
				console.log(result.feed);
				for (var i = 0; i < result.feed.entries.length; i++) {
					var entradaDoFeed = result.feed.entries[i];
					var dataPublicacao = entradaDoFeed.publishedDate;
					feeder.store.findByTitle(entradaDoFeed, result.feed.entries.length, i, 
						function(entradaDoFeed, numeroDeFeeds, feedAtual, taNoBanco) {
							if (!taNoBanco) {
								feeder.store.addNewFeed(feedURL, entradaDoFeed);
							}
							if (numeroDeFeeds == (feedAtual+1)) {
								feeder.removeFeedsOnHtml();
								feeder.putFeedsOnHtml();
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
		feeder.store.findByFeedURL(feedURL, function(result) {
			$("ul").append('<li data-role="divider" data-theme="b">'+tituloDoFeed+'<span class="ui-li-count">'+result.length+'</span></li>');
			for (var i = 0; i < result.length; i++) {
				var entradaDoFeed = result[i];
				var dataPublicacao = entradaDoFeed.publishedDate;
				$("ul").append('<li><a href="'+entradaDoFeed.link+'"><h2>'+entradaDoFeed.title+'</h2><p>'+entradaDoFeed.contentSnippet+'</p><p class="ui-li-aside"><strong>Publicação: '+dataPublicacao.substring(0, dataPublicacao.length - 6)+'</strong>PM</p></a></li>');
			}
			$('ul').listview('refresh');
		});
	},

	initialize: function() {
		this.store = new Storage();
		google.load("feeds", "1");
		google.setOnLoadCallback(feeder.loadFeeds);
	}
};

var feedsPuxados = 10;
var tituloDoFeed;
var feedURL = "http://www.imprensa.usp.br/?feed=rss2";
app.initialize();
feeder.initialize();
window.setInterval(feeder.loadFeeds,30000);
