const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain');

describe('Testing the transaction pool', () => {

    let transactionPool, wallet, transaction, amount = 22, recipient = 'r3c1p13nt';

    transactionPool = new TransactionPool();
    wallet = new Wallet()
    blockchain = new Blockchain()
    transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
    

    it('checks if transactions are added to the transaction pool', ()=> {

        expect(transactionPool.transactions.find(transaction_here => transaction_here.id === transaction.id)).toEqual(transaction);

    });

    it('checks if transaction is updated in the pool after a transaction is updated', () => {
        new_recipient  = 'n3w r3c1p13nt';
        transaction = transaction.update(wallet, new_recipient, '11');
        //console.log("transaction: ", JSON.stringify(transaction));
        //console.log("transaction pool: ", transactionPool);
        expect(JSON.stringify(transactionPool.transactions.find(transaction_here => transaction_here.id === transaction.id))).toEqual(JSON.stringify(transaction));

    });

    it('clears transactions', () => {
        transactionPool.clear();
        expect(transactionPool.transactions).toEqual([]);
    })

    describe('validate detecting valid or invalid transactions', () => {

        beforeEach(() => {
            new_transaction = wallet.createTransaction(recipient, amount + 20, blockchain, transactionPool);
        });

        it('passes a valid transaction', () => {
            expect(JSON.stringify(transactionPool.validTransactions())).toEqual(JSON.stringify(transactionPool.transactions));
        });

        it('it fails a manipulated input', () => {
            //console.log(transactionPool.transactions);
            transactionPool.transactions[0].input.amount = 1000;
            expect(JSON.stringify(transactionPool.validTransactions())).not.toEqual(JSON.stringify(transactionPool.transactions));

        })
    });


});