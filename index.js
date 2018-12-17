
const {SHA256} = require('crypto-js');
const present = require('present');

class Block {
  constructor(index, data, prevHash='') {
    this.index = index;
    this.timestamp = this.getTimestamp();
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calcHash();
  }

  calcHash() {
    return SHA256(
      this.index,+
      this.prevHash+
      this.timestamp+
      JSON.stringify(this.data)
    ).toString();
  }

  getTimestamp() {
    return (""+present()).split('.')[0];
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.initChain()];
  }

  initChain() {
    return new Block(0, 5, "0");
  }

  getLast() {
    return this.chain[this.chain.length-1];
  }

  addBlock(block) {
    block.prevHash = this.getLast().hash;
    block.hash = block.calcHash();
    this.chain.push(block);
  }
}

const sucukCoin = new Blockchain();
sucukCoin.addBlock(new Block("1", 12));

console.log(JSON.stringify(sucukCoin, null, 4));
