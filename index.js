
const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, prevHash='') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = this.calcHash();
  }

  calcHash() {
    return SHA256(
      this.index+
      this.prevHash+
      this.timestamp+
      JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.initChain()];
  }

  initChain() {
    return new Block(0, "17/12/2018", "Root", "0");
  }

  getLast() {
    return this.chain[this.chain.length-1];
  }

  addBlock(block) {
    block.prevHash = this.getLast().hash;
    block.hash = block.calcHash();
    this.chain.push(block);
  }

  isValid() {
    for(let i=1; i<this.chain.length; i++) {
      const cur = this.chain[i];
      const prev = this.chain[i-1];

      if(cur.hash!==cur.calcHash()) {
        return false;
      }
      if(cur.prevHash!==prev.hash) {
        return false;
      }
    }
    return true;
  }
}

let sucukCoin = new Blockchain();
sucukCoin.addBlock(new Block(1, "17/12/2018", {amount: 3}));
sucukCoin.addBlock(new Block(2, "17/12/2018", {amount: 22}));


console.log("Blockchain is valid: " + sucukCoin.isValid());

sucukCoin.chain[1].data = {amount: 100};

console.log("Blockchain is valid: " + sucukCoin.isValid());
