'use strict';

Module.register("1", {

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

    var data = this.result;

    var symbolElement =  document.createElement("span");
    var breakElement =  document.createElement("br");
    
    for (i = 0; i < data.length; i++) {
      var symbol = data[i].pair_name;
      //var lastPrice = data.buy_price;
      var highPrice = data[i].buy_price;
      var lowPrice = data[i].sell_price;
    
      var priceElement = document.createElement("span");
      var lowElement = document.createElement("span");
      var highElement = document.createElement("span");
      
      symbolElement.innerHTML = symbol + ' $';
      wrapper.appendChild(symbolElement);
      priceElement.innerHTML = highPrice;
      wrapper.appendChild(priceElement);
      wrapper.appendChild(breakElement);
      lowElement.className = 'small';
      lowElement.innerHTML = '$' + lowPrice + '&nbsp&nbsp;&nbsp;';
        
      highElement.className = 'small';
      highElement.innerHTML = '$' + highPrice;
            
      lowElement.className = 'small down';
      highElement.className = 'small up';
            
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
