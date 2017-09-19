var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('hako helper started...');
  },

  getData: function (url) {
      var self = this;
      var hakoTickers = new Array(); // List of tickers
      var hakoPairs = new Array(); // List of Pairs

      request({ url: url, method: 'GET' }, function (error, response, body) {
        //console.log("node_helper.js: " + body);
          if (!error && (response.statusCode == 200 || response.statusCode == 429)) {
            //console.log("node_helper.js: body -> " + body);
            var result = JSON.parse(body);
            //console.log("node_helper.js: body json parsed -> " + result);

            for (i = 0; i < result["data"]["crypto_currencies"].length; i++) {
              //console.log("i = " + i);
              for (j = 0; j < result["data"]["fiat_currencies"].length; j++) {
                  //console.log("node_helper.js: hakoticker obj -> " + result["data"]["crypto_currencies"][i]);
                  hakoTickers.push(result["data"]["crypto_currencies"][i]["symbol"] + result["data"]["fiat_currencies"][j]["symbol"]);
              }
            }

            // Retrieve the prices
            for (k = 0; k < hakoTickers.length; k++) {
              request({ url: 'https://coinhako.com/api/v1/price/currency/' + hakoTickers[k], method: 'GET' }, function (error, response, body) {
                if (!error && (response.statusCode == 200 || response.statusCode == 429)) {
                  //console.log("node_helper.js: price api body -> " + body);
                  var result = JSON.parse(body);
                  
                  console.log("node_helper.js: price api pair_name -> " + hakoTickers[k]);
                  console.log("node_helper.js: price api buy_price -> " + result["data"]["buy_price"]);
                  var elementPair = {
                    pair_name: hakoTickers[k],
                    buy_price: result["data"]["buy_price"],
                    sell_price: result["data"]["sell_price"]
                  };

                  console.log("node_helper.js: price api pushing to hakoPairs");
                  hakoPairs.push(elementPair);
                }
              });
            }

            console.log("node_helper.js: dispatching sendSocketNotification");
            self.sendSocketNotification('DATA_RESULT', hakoPairs);
          }

          if (error) {
            console.log("[ERROR] node_helper.js: Error -> " + error);
          } 
          // else {
          //   console.log("Status Code: " + response.statusCode);
          // }
      });

  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_DATA') {
      console.log("node_helper.js: socketNotificationReceived");
      this.getData(payload);
    }
  }

});
