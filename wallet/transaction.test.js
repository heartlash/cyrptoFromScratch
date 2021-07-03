const Transaction = require('./transaction');
const Wallet = require('./index');
const { INITIAL_BALANCE, MINE_RATE, MINING_REWARD } = require('../config');

describe('Transaction', () => {

    let transaction, amount = 50, wallet, recipient = 'r3c1pi3nt';

    beforeEach(() => {
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('reflects the transaction output with correct amount balance for the sender', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);

    });

    it('reflects the transaction output with correct amount to be sent to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it('transactions input amount matches sender amount', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

     
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 5;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('Trying to transact amount exceeding balance', () => {

        beforeEach(() => {
            amount = 5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        });

        it('Transaction exceeds balance', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('Updating a transaction', () => {

        beforeEach(() => {
            amount = 50;
            new_recipient = 'djdjdjdj';
            transaction = Transaction.newTransaction(wallet, recipient, amount)
         
            transaction = transaction.update(wallet, new_recipient, 66);

            //console.log(wallet);
        });

        it('checks for updated outputs', () => {
            expect(transaction.outputs.find(output => output.address === new_recipient).amount).toEqual(66);
        });

        it('checks the updated output on the senders array', () => {

            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - 66);
        })


    });

    describe('testing the reward transactions', () => {
        let minerWallet, blockchainWallet, rewardTransaction;
        minerWallet = new Wallet();
        blockchainWallet = Wallet.blockchainWallet();
        beforeEach(() => {
            rewardTransaction = Transaction.rewardTransaction(minerWallet, blockchainWallet);

        });

        it('the reward transaction is successful', () => {
            console.log(JSON.stringify(rewardTransaction));
            expect(rewardTransaction.outputs.find(output => output.address === minerWallet.publicKey).amount).toEqual(MINING_REWARD);
        })
    });


});