class Pair {
    constructor(name, buy, sell) {
        this._name = name;
        this._buyprice = buy;
        this._sellprice = sell;
    }

    getName() {
        return this._name;
    }

    getBuyPrice() {
        return this._buyprice;
    }

    getSellPrice() {
        return this._sellprice;
    }

    setName(name) {
        this._name = name;
    }

    setBuyPrice(price) {
        this._buyprice = price;
    }

    setSellPrice(price) {
        this._sellprice = price;
    }
}

