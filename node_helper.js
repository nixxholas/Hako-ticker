var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log(this.name + ' helper method started...');
  },

  // For retrieving ticker price
  sendRequest: function (url, tickers) {
      var self = this;

      for (i = 0; i < tickers.length; i++) {
        request({ url: url + tickers[i], method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            //console.log(result)
            self.sendSocketNotification('STOCK_RESULT', result);
          }
        });
      }

  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, urls, tickers) {
    if (notification === 'GET_STOCKS') {
      //console.log(url)
      
      // ========= Retrieve the tickers first ========= //

      var hakoTickers = new Array();
      // CoinHako first
      request({
        method: 'GET',
        url: tickers[0]
      })
        .then(function (resp) {
          var response = JSON.Parse(resp);
          for (i = 0; i < response["data"]["crypto_currencies"]; i++) {
            for (j = 0; j < response["data"]["fiat_currencies"]; j++) {
                hakoTickers.push(response["data"]["crypto_currencies"][i]["symbol"] + response["data"]["fiat_currencies"][j]["symbol"]);
            }
          }
      });
  
      // Bitfinex

      // Bittrex

      // Bitstamp

      this.sendRequest(urls[0], hakoTickers);
    }
  }

});