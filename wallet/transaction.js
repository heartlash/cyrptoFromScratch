const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transaction{

    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount){
        //console.log('from update : ', senderWallet);

        const senderOutput = this.outputs.find(output => 
           
            output.address == senderWallet.publicKey
        );
        //console.log("sender output: ", senderOutput);
        //console.log('from update: ', this);
        if(amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds the balance`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address: recipient});
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount){
        const transaction = new this();

        if (amount > senderWallet.balance){
            console.log(`Amount: ${amount} exceeds balance`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{amount: MINING_REWARD, address: minerWallet.publicKey}]);
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timeStamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        //console.log("transaction input address: ", transaction.input.address, "\ntransacction input signature: ", transaction.input.signature, "\ntransaction outputs: ", ChainUtil.hash(transaction.outputs));
        return ChainUtil.verifySignature(transaction.input.address, transaction.input.signature, ChainUtil.hash(transaction.outputs));
    }

}

module.exports = Transaction;