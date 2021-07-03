const Blockchain = require('./index')
const Block = require('./block')


describe('Blockchain', () => {

    let blockchain;
    let blockchain1;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchain1 = new Blockchain();
    });

    it('the blockchain starts with the genesis block', () => {

        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('it adds the block properly to the blockchain', () => {
        const data = "add block test data";
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length -1].data).toEqual(data);
    });

    it('it validates a valid chain', () => {

        blockchain1.addBlock('Data for new block');

        expect(blockchain1.isValidChain(blockchain1.chain)).toBe(true);
    });

    it('it tests the chain has correct genesis block', () => {
        blockchain1.chain[0].data = 'Manipulated genesis block data';

        expect(blockchain1.isValidChain(blockchain1.chain)).toBe(false);
    });

    it('invalids a tampered chain', () => {
        blockchain1.addBlock('Original block data');

        blockchain1.chain[1].data = 'Manipulated block data';
        expect(blockchain1.isValidChain(blockchain1.chain)).toBe(false);
    });

    it('A valid new chain replaces old chain', () => {
        blockchain1.addBlock('Anything really');

        blockchain.replaceChain(blockchain1.chain);
        expect(blockchain.chain).toEqual(blockchain1.chain)
    });

    it('Does not replace chains of lesser length than the original chain', () =>{

        blockchain.addBlock('Again anything really');
        blockchain.replaceChain(blockchain1.chain);
        expect(blockchain.chain).not.toEqual(blockchain1.chain)

    })

});