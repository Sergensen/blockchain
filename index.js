
const SHA256 = require('crypto-js/sha256');
const present = require('present');

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class Block {
  constructor(transactions, prevHash='') {
    this.timestamp = present();
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calcHash();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
      this.nonce++;
      this.hash = this.calcHash();
    }
  }

  calcHash() {
    return SHA256(
      this.prevHash+
      this.timestamp+
      this.nonce+
      JSON.stringify(this.transactions)
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.initChain()];
    this.difficulty = 5;
    this.pendingTransactions = [];
    this.miningReward = 50;
  }

  initChain() {
    return new Block("Root", "0");
  }

  getLast() {
    return this.chain[this.chain.length-1];
  }

  minePendingTransactions(rewardAddress) {
    let block = new Block(this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block "+block.hash+" successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, rewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if(trans.to===address) balance += trans.amount;
        if(trans.from===address) balance -= trans.amount;
      }
    }
    return balance;
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
sucukCoin.createTransaction(new Transaction("OttersSucukAdresse", "SergensSucukAdresse", 50));
sucukCoin.createTransaction(new Transaction("SergensSucukAdresse", "OttersSucukAdresse", 100));

console.log("\n Mining...");
sucukCoin.minePendingTransactions("IljasSucukAdresse")

console.log("\n Balance of Ilja is ", sucukCoin.getBalanceOfAddress("IljasSucukAdresse"));


console.log("\n Mining again ...");
sucukCoin.minePendingTransactions("IljasSucukAdresse")

console.log("\n Balance of Ilja is ", sucukCoin.getBalanceOfAddress("IljasSucukAdresse"));
