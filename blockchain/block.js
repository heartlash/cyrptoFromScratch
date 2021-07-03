const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE }= require('../config');


class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block - 
        Timestamp  : ${this.timestamp}
        LastHash   : ${this.lastHash.substring(0, 20)}
        Hash       : ${this.hash.substring(0, 20)}
        Data       : ${this.data}
        Nonce      : ${this.nonce}
        Difficulty : ${this.difficulty}`
    }

    static genesis(){
        return new this('Genesis time',  'Genesis last hash', 'Genesis hash', 'Genesis data', '0', DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let nonce=0, hash, timestamp, difficulty;
        
        do{
            nonce++;
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastBlock.hash, data, nonce, difficulty);
            //console.log("Each iteration:\n", "\nlastBlockTimeStamp: ", lastBlock.timestamp, "nonce: ", nonce, "\ntimestamp: ", timestamp, "\ndifficulty: ", difficulty, "\hash: ", hash)

        }while(hash.substring(0, difficulty) != '0'.repeat(difficulty));

        return new this(timestamp, lastBlock.hash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block){
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1: difficulty - 1;
        return difficulty;
    }
}





module.exports = Block;  