'use strict';

let currData = new Array();

Module.register("Hako-ticker", {

  hakoallapi: "https://coinhako.com/api/v1/price/all_prices",
  result: {},
  defaults: {
    debugging: true,
    fiat: 'usd',
    showBefore: null,
    exchange: 'bitstamp',
    updateInterval: 60000,

    // Used to work out url and symbols
    fiatTable: {
      usd: {
        symbol: '$',
        exchangeCode: 'btcusd'
      },
      eur: {
        symbol: '€',
        exchangeCode: 'btceur'
      }
    }
  },

  getScripts: function() {
      return [
        this.file('Pair.js')
      ]
  },

  getStyles: function() {
    return ["Hako-ticker.css"];
  },

  start: function() {
    this.getTickers();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = 'medium bright';
    wrapper.className = 'marquee ticker';
    let currentData = this.currData;

    if (this.config.debugging) {
      console.log("getDom():" + currData);
    }

    var data = this.results;

    // if (this.config.debugging) {
    //   console.log("getDom():" +  JSON.stringify(data));
    // }

    if (currentData) { // If current data exists
      // We iterate through each of them and do a cross check.
      console.log("getDom() pushing all pairs with checks");
      for (var pair in data.data) {
        for (i = 0; i < currData.length; i++) {
          // TODO: PERFORM NOT FOUND CHECKS
          if (currentData[i].getName() == pair.getName()) {
            currentData[i].setBuyPrice(data.data[pair]["buy_price"]);
            currentData[i].setSellPrice(data.data[pair]["sell_price"]);
            break;
          }
        }
      }  
    } else {
       // Else we perform an alternate process and add the pairs in
       console.log("getDom() pushing all pairs unconditionally");

      for (var pair in data.data) {
        // if (this.config.debugging) {
        //   console.log("getDom() data array element:" +  pair);
        // }

        // if (this.config.debugging) {
        //   console.log("getDom() pair object:" +  data.data[pair]);
        // }
        
        let pair = new Pair(pair, data.data[pair]["buy_price"], data.data[pair]["sell_price"]);
        
        if (this.config.debugging) {
          console.log("getDom() pair object:" +  pair.getName());
        }
        
        currentData.push(pair);
      }
    }

    var symbolElement =  document.createElement("span");
    // var exchange = this.config.exchange;
    // var fiat = this.config.fiat;
    // var fiatSymbol = this.config.fiatTable[fiat].symbol;
    var lastPrice = 'Faster, Bank of Choina gonna make u do more work =/'; //data.last
    // if (this.config.showBefore == null) {
    //   var showBefore = this.config.exchange;
    // } else {
    //   var showBefore = this.config.showBefore
    // }

    if (lastPrice) {
      //symbolElement.innerHTML = showBefore + ' ' + fiatSymbol;
      //symbolElement.innerHTML = 'BTCUSD IS NOW 4000000.39';
      //wrapper.appendChild(symbolElement);
      var priceElement = document.createElement("span");
      priceElement.innerHTML = lastPrice;
      wrapper.appendChild(priceElement);
    }
    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getTickers();
    }, nextLoad);
  },

  getTickers: function () {
    var url = 'https://coinhako.com/api/v1/price/all_prices';
    this.sendSocketNotification('GET_TICKERS', url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "TICKERS_RESULT") {
      var self = this;
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});