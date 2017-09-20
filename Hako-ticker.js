Module.register("Hako-ticker", {

  hakoallapi: "https://coinhako.com/api/v1/price/all_prices",
  result: {},
  currData: [],
  defaults: {
    debugging: true,
    fiat: 'usd',
    showBefore: null,
    exchange: 'bitstamp',
    updateInterval: 600000,

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

  getStyles: function() {
    return ["Hako-ticker.css"];
  },

  start: function() {
    this.getTickers();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("marquee");
    wrapper.className = 'medium bright';
    wrapper.className = 'ticker';
    
    var currentData = this.currData;

    var data = this.result;

    if (currentData.length > 0) { // If current data exists
      // We iterate through each of them and do a cross check.
      //console.log("getDom(): pushing all pairs with checks");
      for (var pair in data.data) {
        //console.log("getDom() within update for loop");
        for (var i = 0; i < currentData.length; i++) {
          //console.log("getDom() update loop count: " + i);
          // TODO: PERFORM NOT FOUND CHECKS
          if (currentData[i].name == pair) {
            // If the last price is lower than the latest price
            if ((currentData[i].buyprice - data.data[pair]["buy_price"]) < 0) {
              // It went up! =D
              currentData[i].status = 2;
            } else if ((currentData[i].buyprice - data.data[pair]["buy_price"]) > 0) {
              // It went down =(
              currentData[i].status = 0;
            } else {
              currentData[i].status = 1; // Neutral then
            }

            currentData[i].buyprice = data.data[pair]["buy_price"];
            currentData[i].sellprice = data.data[pair]["sell_price"];
            break;
          }
        }
      }  
    } else {
       // Else we perform an alternate process and add the pairs in
       //console.log("getDom() pushing all pairs unconditionally");

      for (var pair in data.data) {
        this.currData.push({
          name: pair,
          buyprice: data.data[pair]["buy_price"],
          sellprice: data.data[pair]["sell_price"],
          status: 1, // 0 - Down, 1 - Initial, 2 - Up
        });
      }

      //console.log("Unconditional push complete. Data: " + currentData);
    }

    // CoinHako's BTC first
    var coinhakoBTCElement = document.createElement("span");
    var coinhakoBTCText = '';

    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i].name.indexOf("BTC") !== -1) {
        console.log("Found a BTC pair: " + currentData[i].name);
        //if (i != 0) coinhakoBTCText += "\t";

        var currentPairElement = document.createElement("span");
        switch (i) {
          case 0: // Down
            currentPairElement.className = 'down';
            break;
          case 1: // Nothing
            break;
          case 2: // Up
            currentPairElement.className = 'up';
            break;
          default:
            break;
        }

        currentPairElement.innerHTML = currentData[i].name + ' ' + currentData[i].buyprice;
        coinhakoBTCElement.appendChild(currentPairElement);
      }
    }

    // CoinHako's ETH

    var symbolElement =  document.createElement("span");
    // var exchange = this.config.exchange;
    // var fiat = this.config.fiat;
    // var fiatSymbol = this.config.fiatTable[fiat].symbol;
    var lastPrice = 'I dare u to ping flood 192.168.2.202.'; //data.last
    // if (this.config.showBefore == null) {
    //   var showBefore = this.config.exchange;
    // } else {
    //   var showBefore = this.config.showBefore
    // }

    if (coinhakoBTCText) {
      //symbolElement.innerHTML = showBefore + ' ' + fiatSymbol;
      //symbolElement.innerHTML = 'BTCUSD IS NOW 4000000.39';
      //wrapper.appendChild(symbolElement);
      //var priceElement = document.createElement("span");
      //coinhakoBTCElement.innerHTML = coinhakoBTCText;
      wrapper.appendChild(coinhakoBTCElement);
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