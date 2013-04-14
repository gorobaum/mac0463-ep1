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

	updateFeedsURL: function() {
		feeder.store.refreshConfigs(function(results) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].value == 1) {

				}
			};
		});
	},

	updateFeeds: function() {
		var feed = new google.feeds.Feed(feedURL);
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
			$("ul").append('<li data-role="divider" data-theme="b">'+tituloDoFeed.substring(0, 39)+'<span class="ui-li-count">'+result.length+'</span></li>');
			for (var i = 0; i < result.length; i++) {
				var entradaDoFeed = result[i];
				var dataPublicacao = entradaDoFeed.publishedDate;
				$("ul").append('<li><a href="'+entradaDoFeed.link+'"><h2>'+entradaDoFeed.title+'</h2><p>'+entradaDoFeed.contentSnippet+'</p><p class="ui-li-aside"><strong>Publicação: '+dataPublicacao.substring(0, dataPublicacao.length - 6)+'</strong>PM</p></a></li>');
			}
			$('ul').listview('refresh');
		});
	},

	saveConfigs: function() {
		for (var i = 0; i < listaDeCheckbox.length; i++) {
			if($("#" + listaDeCheckbox[i]).is(":checked")) {
				feeder.store.addNewConfig(mapIdsFeeds[listaDeCheckbox[i]], 1);
				console.log(listaDeCheckbox[i] + "  TRUE");
			} else {
				feeder.store.addNewConfig(mapIdsFeeds[listaDeCheckbox[i]], 0);
				console.log(listaDeCheckbox[i] + "  FALSE");
			}
		}
	},

	initialize: function() {
		this.store = new Storage();
		google.load("feeds", "1");
		google.setOnLoadCallback(feeder.loadFeeds);

		mapFeedsURL["Cultura e artes"] = "cultura-e-artes";
		mapFeedsURL["Esportes"] = "esportes";
		mapFeedsURL["Evento científico"] = "evento-cientifico"
		mapFeedsURL["Evento científico – biológicas"] = "evento-cientifico-biologicas";
		mapFeedsURL["Evento científico – exatas"] = "evento-cientifico-exatas";
		mapFeedsURL["Evento científico – humanas"] = "evento-cientifico-humanas";
		mapFeedsURL["Institucional"] = "institucional";
		mapFeedsURL["Outros"] = "outros";

		mapIdsFeeds["checkbox-cultura"] = "Cultura e artes";
		mapIdsFeeds["checkbox-esportes"] = "Esportes";
		mapIdsFeeds["checkbox-bio"] = "Evento científico"
		mapIdsFeeds["checkbox-exatas"] = "Evento científico – biológicas";
		mapIdsFeeds["checkbox-eventos"] = "Evento científico – exatas";
		mapIdsFeeds["checkbox-humanas"] = "Evento científico – humanas";
		mapIdsFeeds["checkbox-institucional"] = "Institucional";
		mapIdsFeeds["checkbox-outros"] = "Outros";

		listaDeCheckbox.push("checkbox-cultura");
		listaDeCheckbox.push("checkbox-esportes");
		listaDeCheckbox.push("checkbox-eventos");
		listaDeCheckbox.push("checkbox-bio");
		listaDeCheckbox.push("checkbox-exatas");
		listaDeCheckbox.push("checkbox-humanas");
		listaDeCheckbox.push("checkbox-institucional");
		listaDeCheckbox.push("checkbox-outros");
	}
};

var feedsPuxados = 10;
var tituloDoFeed;
var feedURL = "http://www.eventos.usp.br/?event-types=outros&feed=rss";
var mapFeedsURL = {};
var mapIdsFeeds = {};
var listaDeCheckbox = [];
app.initialize();
feeder.initialize();
window.setInterval(feeder.loadFeeds,30000);
