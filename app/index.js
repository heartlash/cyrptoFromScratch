const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const  HTTP_PORT = process.env.HTTP_PORT || 3002;

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);
const wallet = new Wallet();
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);




app.use(express.json());

app.get('/blocks', (req, res) => {

    console.log("Kela re");
    res.json(blockchain.chain);
});

app.post('/mineBlock', (req, res) => {

    console.log("comes here:", req.body);
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    console.log('jaath baal');
    res.json(transactionPool.transactions);
});

app.post('/transact', (req, res) => {

    const {recipient, amount} = req.body;
    transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {

    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');

});

app.get('/public-key', (req, res) => {
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => 
    console.log(`Listening on port ${HTTP_PORT}`));

p2pServer.listen();