# MMM-ethereum
An `ethereum ticker` <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module.
Based on the <a href="https://github.com/valmassoi/MMM-bitcoin">valmassoi/MMM-bitcoin</a> module.

## Installing the module
Clone this repository in your `~/MagicMirror/modules/` folder `( $ cd ~MagicMirror/modules/ )`:
````javascript
git clone https://github.com/Deathrid3r747/MMM-ethereum
````

## Using the module
Add `MMM-ethereum` module to the `modules` array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'MMM-ethereum',
    position: 'top_right',
    config: {
      updateInterval: 30000,
      exchange: "kraken"
    }
  },
]
````

## Configuration options

| Option           | Description
|----------------- |-----------
| `updateInterval` | *Optional*<br/>The API allowes for 2000000000 nanoseconds (2 seconds) of CPU time per hour, and allowance is reset every hour, on the hour.<br/>Each update uses between 2500000 and 10000000 nanoseconds<br/>Based on the maximum 10000000 nanoseconds, the allowance is 200 updates per hour<br/>That means one update every 18 seconds<br/><br/><a href="https://cryptowat.ch/docs/api#rate-limit">API Documentation can be found here</a><br><br>**Type:** `int`(milliseconds) <br>Default 30000 milliseconds (30 seconds)
| `exchange`	   | *Optional*<br/>The exchange used to get the data<br/><br/>Can be any item from <a href="https://api.cryptowat.ch/markets">THIS LIST</a> with a *currencyPair* of *ethusd* <br><br>**Type:** `String` <br>Default "kraken"
| `showHighLow`	   | *Optional*<br/>Show the 24 hour high/low <br><br>**Type:** `Boolean` <br>Default *true*
| `highLowColor`   | *Optional*<br/>*true*: Show the 24 hour high/low in color<br/>*false*: Show the 24 hour high/low in white<br/><br/>**Type:** `Boolean` <br>Default *true*

## To Do
* **Create issues to track these**
* ~API allows for different exchanges, allow setting this via configuration~
* ~24h high/low values on the ticker~
* Last change indicator (Green = price went up, Red = Price went down)
* Current hashrate for mining rig
* Alert when miner goes offline
* Average hashrate for mining rig
* Pending payout for mining
* Mining calculator based on average mining
* Convert USD value to local currency (Configurable - ZAR in my case)
* Add ticker graph (minute, hour, day, week, month, year)
* Possible future extensibility to allow for different cryptocurrencies
