Module.register("Hako-ticker", {

    hakoallapi: "https://coinhako.com/api/v1/price/all_prices",
    result: {},
    currData: [],
    defaults: {
        updateInterval: 5000,
    },

    getStyles: function() {
        return ["Hako-ticker.css"];
    },

    start: function() {
        this.getTickers();
        this.scheduleUpdate();
    },

    getDom: function() {
        console.log("Running getDom()");
        var data = this.result;

        this.updateData(data);

        return this.updateUI();
    },

    updateData: function(data) {
        //console.log("updateData(): Running updateData");
        //console.log("data: " + JSON.stringify(data));
        //console.log("inner data: " + JSON.stringify(data["data"]));

        if (this.currData.length > 0) { // If current data exists
            // We iterate through each of them and do a cross check.
            //console.log("getDom(): pushing all pairs with checks");
            for (var pair in data.data) {
                //console.log("getDom() within update for loop");
                //console.log(data.data[pair]);
                //console.log(data.data[pair]["buy_price"]);

                for (var i = 0; i < this.currData.length; i++) {
                    //console.log("getDom() update loop count: " + i);
                    // console.log(pair);
                    // console.log(data.data[pair]);
                    //console.log(pair + " is " + this.currData[i].name + ": " + (this.currData[i].name == pair));

                    // TODO: PERFORM NOT FOUND CHECKS
                    if (this.currData[i].name === pair) {
                        //console.log("Pair: " + pair);
                        //console.log("Pair buy price: " + data.data[pair]["buy_price"]);
                        //console.log(this.currData[i].name + " discrepancy: " + (data.data[pair]["buy_price"] - this.currData[i].buyprice));

                        // If the last price is lower than the latest price
                        //console.log("Old buy price for " + currentData[i].name + " : " + currentData[i].buyprice);
                        if ((data.data[pair]["buy_price"] - this.currData[i].buyprice) > 0) {
                            // It went up! =D 
                            //console.log("Bull check: " + ((data.data[pair]["buy_price"] - this.currData[i].buyprice) > 0));
                            this.currData[i].status = 2;
                        } else if ((data.data[pair]["buy_price"] - this.currData[i].buyprice) < 0) {
                            // It went down =(
                            //console.log("Bear check: " + ((data.data[pair]["buy_price"] - this.currData[i].buyprice) < 0));
                            this.currData[i].status = 0;
                        } else {
                            //console.log("Neutrality value:" + (data.data[pair]["buy_price"] - this.currData[i].buyprice))
                            //console.log("Neutrality check: " + ((data.data[pair]["buy_price"] - this.currData[i].buyprice) > 0));

                            // Since it already exists, just ignore
                            //this.currData[i].status = 1; // Neutral then
                        }

                        // Update the prices thereafter
                        this.currData[i].buyprice = data.data[pair]["buy_price"];
                        this.currData[i].sellprice = data.data[pair]["sell_price"];
                        break;
                    }
                }
            }
        } else {
            // Else we perform an alternate process and add the pairs in
            //console.log("getDom() pushing all pairs unconditionally");
            console.log(this.currData.length);

            if (this.currData.length === 0) {
                for (var pair in data.data) {
                    this.currData.push({
                        name: pair,
                        buyprice: data.data[pair]["buy_price"],
                        sellprice: data.data[pair]["sell_price"],
                        status: 1, // 0 - Down, 1 - Initial, 2 - Up
                    });
                }
            }

            //console.log("Unconditional push complete. Data: " + currentData);
        }
    },

    updateUI: function() {
        var moduleWrapper = document.createElement("table");
        moduleWrapper.className = 'ui inverted table';

        var wrapper = document.createElement("tbody");

        // CoinHako's BTC first
        //console.log("getDom(): Running UI Update");
        var coinhakoBTCElement = document.createElement("tr");
        for (var i = 0; i < this.currData.length; i++) {
            if (this.currData[i].name.indexOf("BTC") !== -1) {
                //console.log("Found a BTC pair: " + currentData[i].name);

                var currentPairText = '';
                // if (i > 0) {
                //     currentPairText += "\t";
                // }

                //currentPairText = this.currData[j].name + '  ' + this.currData[j].buyprice;
                // https://stackoverflow.com/questions/5131867/removing-the-first-3-characters-from-a-string
                currentPairText += '<i class="bitcoin icon"></i>' + this.currData[i].name.substring(3) + ' ' + this.currData[i].buyprice;

                var currentPairElement = document.createElement("td");
                switch (this.currData[i].status) {
                    case 0: // Down
                        currentPairElement.className = 'down';
                        currentPairText += ' <i class="frown icon"></i>';
                        break;
                    case 2: // Up
                        currentPairElement.className = 'up';
                        currentPairText += ' <i class="space shuttle icon"></i>';
                        break;
                    default:
                        currentPairElement.className = 'ticker';
                        currentPairText += ' <i class="minus icon"></i>';
                        break;
                }

                currentPairElement.innerHTML = currentPairText;

                if (currentPairText) {
                    currentPairElement.innerHTML += "\t";
                    coinhakoBTCElement.appendChild(currentPairElement);
                }
            }
        }

        wrapper.appendChild(coinhakoBTCElement);

        var coinhakoETHElement = document.createElement("tr");
        for (var j = 0; j < this.currData.length; j++) {
            if (this.currData[j].name.indexOf("ETH") !== -1) {
                //console.log("Found a ETH pair: " + currentData[i].name);

                var currentPairText = '';
                // if (i > 0) {
                //     currentPairText += "\t";
                // }

                //currentPairText = this.currData[j].name + '  ' + this.currData[j].buyprice;
                currentPairText += '<i class="cc ETH-alt"></i>' + this.currData[j].name.substring(3) + '  ' + this.currData[j].buyprice;

                var currentPairElement = document.createElement("td");
                switch (this.currData[j].status) {
                    case 0: // Down
                        currentPairElement.className = 'down';
                        currentPairText += ' <i class="frown icon"></i>';
                        break;
                    case 2: // Up
                        currentPairElement.className = 'up';
                        currentPairText += ' <i class="space shuttle icon"></i>';
                        break;
                    default:
                        currentPairElement.className = 'ticker';
                        currentPairText += ' <i class="minus icon"></i>';
                        break;
                }

                currentPairElement.innerHTML = currentPairText;

                if (currentPairText) {
                    coinhakoETHElement.appendChild(currentPairElement);
                }
            }
        }

        wrapper.appendChild(coinhakoETHElement);

        // var coinhakoLTCElement = document.createElement("tr");

        // var newPairElement = document.createElement("td");
        // newPairElement.className = 'up';
        // var newPairText = '';
        // newPairText += '<i class="cc LTC-alt"></i> USD' + '  100000';

        // newPairElement.innerHTML = newPairText;

        // coinhakoETHElement.appendChild(newPairElement);
        
        // wrapper.appendChild(coinhakoLTCElement);

        moduleWrapper.appendChild(wrapper);
        return moduleWrapper;
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

    getTickers: function() {
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