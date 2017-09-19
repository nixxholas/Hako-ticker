'use strict';

Module.register("Hako-ticker", {

  result: {},
  defaults: {
    updateInterval: 30000,
	  showHighLow: true,
    highLowColor: true
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
    wrapper.className = 'ticker';

    var data = this.result.result;
    var symbolElement =  document.createElement("span");
	  var breakElement =  document.createElement("br");
    var symbol = data.pair_name;
	  //var lastPrice = data.buy_price;
	  var highPrice = data.buy_price;
	  var lowPrice = data.sell_price;
	
    symbolElement.innerHTML = symbol + ' $';
    wrapper.appendChild(symbolElement);
    var priceElement = document.createElement("span");
    priceElement.innerHTML = highPrice;
    wrapper.appendChild(priceElement);
	  wrapper.appendChild(breakElement);
	  
	  if (this.config.showHighLow) {
		  var lowElement = document.createElement("span");
		  lowElement.className = 'small';
		  lowElement.innerHTML = '$' + lowPrice + '&nbsp&nbsp;&nbsp;';
		  
		  var highElement = document.createElement("span");
		  highElement.className = 'small';
		  highElement.innerHTML = '$' + highPrice;
          
          if (this.config.highLowColor) {
              lowElement.className = 'small down';
              highElement.className = 'small up';
          }
          
          wrapper.appendChild(lowElement);
		  wrapper.appendChild(highElement);
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
    var url = 'https://www.coinhako.com/api/v1/wallet/supported_currencies';
	  this.sendSocketNotification('GET_DATA', url);
  },

  socketNotificationReceived: function(notification, payload, payload2) {
    if (notification === "DATA_RESULT") {
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});
