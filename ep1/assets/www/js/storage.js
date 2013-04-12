var Storage = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("RSSFeedDB", "1.0", "RSS Feed DB", 200000);
        this.db.transaction(
                function(tx) {
                    self.createTable(tx);
                },
                function(error) {
                    console.log('Transaction error: ' + error);
                    if (errorCallback) errorCallback();
                },
                function() {
                    console.log('Transaction success');
                    if (successCallback) successCallback();
                }
        )
    }

    this.createTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS rssfeed');
        var sql = "CREATE TABLE IF NOT EXISTS rssfeed ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "feedURL VARCHAR(200), " +
            "link VARCHAR(200), " +
            "title VARCHAR(200), " +
            "contentSnippet VARCHAR(500), " +
            "publishedDate VARCHAR(50), " +
            "categorias VARCHAR(50))";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.addNewFeed = function(feedURL, newFeed) {
        this.db.transaction(
            function(tx) {
                var sql = "INSERT OR REPLACE INTO rssfeed " +
                    "(feedURL, link, title, contentSnippet, publishedDate, categorias) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";

                tx.executeSql(sql, [feedURL, newFeed.link, newFeed.title, newFeed.contentSnippet, newFeed.publishedDate, newFeed.categorias],
                            function() {
                                console.log('INSERT success');
                            },
                            function(tx, error) {
                                alert('INSERT error: ' + error.message);
                            });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findByTitle = function(feed, numeroDeFeeds, feedAtual, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * " +
                    "FROM rssfeed " +
                    "WHERE title LIKE ? " +
                    "ORDER BY id";
                tx.executeSql(sql, ['%' + feed.title + '%'], function(tx, results) {
                    callback(feed, numeroDeFeeds, feedAtual, results.rows.length === 1 ? true : false);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findByFeedURL = function(feedURL, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * " +
                    "FROM rssfeed " +
                    "WHERE feedURL LIKE ? " +
                    "ORDER BY id";

                tx.executeSql(sql, ['%' + feedURL + '%'], function(tx, results) {
                    var len = results.rows.length,
                        feeds = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        feeds[i] = results.rows.item(i);
                    }
                    callback(feeds);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * " +
                    "FROM rssfeed " +
                    "WHERE id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.initializeDatabase(successCallback, errorCallback);

}
