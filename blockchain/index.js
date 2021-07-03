const Block = require('./block');

class Blockchain {

    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        
        const block = Block.mineBlock(this.chain[this.chain.length -1], data);
        this.chain.push(block);
        console.log("Added block");
        return block;
    }

    isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        }

        for(let i =1; i < chain.length; i++){

            const block = chain[i];
            const previousBlock = chain[i-1];

            if(block.lastHash != previousBlock.hash || block.hash != Block.blockHash(block)){
                return false
            }
        }

        return true;
    }

    replaceChain(newChain){ 

        console.log('this chain: ', this.chain);
        console.log('new chain', newChain);
        if (this.chain.length >= newChain.length){
            console.log("New chain is smaller or equal to current chain - Replace operation denied");
            return;
        }
        else if (!this.isValidChain(newChain)){
            console.log("New chain not valid - Replace operation denied");
            return;
        }
        console.log('Replace request accepted');
        this.chain = newChain;
    }

}

module.exports = Blockchain;