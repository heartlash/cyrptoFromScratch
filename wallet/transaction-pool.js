const Transaction = require('./transaction');
class TransactionPool {

    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
        
        let transactionWithId = this.transactions.find(transaction_here => transaction_here.id === transaction.id)
        
        if(transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        }
        else{
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address){
        return this.transactions.find(transaction => transaction.input.address === address);
    }

    validTransactions(){
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
            
                return parseInt(total)+ parseInt(output.amount);
            }, 0);

            if(transaction.input.amount !== outputTotal){
                console.log(`Invalid ${outputTotal} transaction from ${transaction.input.address}.`);
                return;
            }

            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }

            return transaction;
        });

    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;