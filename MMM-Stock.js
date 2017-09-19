'use strict';

Module.register("MMM-Stock", {

  result: {},
  defaults: {
    updateInterval: 60000,
    fadeSpeed: 1000,
    currency: 'usd',
    baseURLs: ['https://coinhako.com/api/v1/price/currency/', 
                'https://api.bitfinex.com/v1', 
                'https://bittrex.com/api/v1.1/public/getticker', // Requires parameter market (market = BTC-LTC)
                'https://www.bitstamp.net/api/ticker/'],
    baseTickerURLs: ['https://www.coinhako.com/api/v1/wallet/supported_currencies', 
                'https://api.bitfinex.com/v1/symbols']
  },

  getStyles: function() {
    return ["MMM-Stock.css"];
  },

  start: function() {
    this.getStocks();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "quotes";
    var list = document.createElement("ul");

    var data = this.result;
    // the data is not ready
    if(Object.keys(data).length === 0 && data.constructor === Object){
      return wrapper;
    }
    var count =  data.query.count;
    //console.log(count)

    for (var i = 0; i < count; i++) {
      var stockData = data.query.results.quote[i];
      var symbol = stockData.symbol;
      var change = stockData.Change;
      var name = stockData.Name;
      var price = stockData.LastTradePriceOnly;
      var pChange = stockData.PercentChange;
      var priceClass = "greenText", priceIcon="up_green";
      if(change < 0) {
         priceClass = "redText";
         priceIcon="down_red";
      }

      var html = "";
      var priceClass = "greentext", priceIcon="up_green";
      if(change < 0) { 
        priceClass = "redtext";
        priceIcon="down_red"; 
      }
      html = html + "<span class='" + priceClass + "'>";
      html = html + "<span class='quote'>" + name + " (" + symbol + ")</span> ";
      
      html = html + parseFloat(price).toFixed(2) + " " + stockData.Currency;
        
      html = html + "<span class='" + priceIcon + "'></span>" + parseFloat(Math.abs(change)).toFixed(2) + " (";
      html = html + parseFloat( Math.abs(pChange.split('%')[0])).toFixed(2) + "%)</span>";

      var stock = document.createElement("span");
      stock.className = "stockTicker";
      stock.innerHTML = html;

      var listItem = document.createElement("li");
      //listItem.appendChild(stock);
      listItem.innerHTML = html;
      list.appendChild(listItem);
    }
    wrapper.appendChild(list);

    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var loadTime = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      loadTime = delay;
    }

    var that = this;
    setInterval(function() {
      that.getStocks();
    }, loadTime);
  },

  getStocks: function () {
    this.sendSocketNotification('GET_STOCKS', baseURLs, baseTickerURLs);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STOCK_RESULT") {
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});