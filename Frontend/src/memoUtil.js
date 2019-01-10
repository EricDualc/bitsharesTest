import {Aes, PrivateKey} from 'bitsharesjs';
import secureRandom from 'secure-random';
import Long from 'bytebuffer';

var unique_nonce_entropy = null;

function toPrivateObj(o) { return o ? o.d ? o : PrivateKey.fromWif(o) : o }

function unique_nonce_uint64() {
    var entropy = unique_nonce_entropy = ((() => {

            if (unique_nonce_entropy === null) {
                //console.log('... secureRandom.randomUint8Array(1)[0]',secureRandom.randomUint8Array(1)[0])
                return parseInt(secureRandom.randomUint8Array(1)[0]);
            } else {
                return ++unique_nonce_entropy % 256;
            }
    })()
    );
    var long = Long.Long.fromNumber(Date.now());
    //console.log('unique_nonce_uint64 date\t',ByteBuffer.allocate(8).writeUint64(long).toHex(0))
    //console.log('unique_nonce_uint64 entropy\t',ByteBuffer.allocate(8).writeUint64(Long.fromNumber(entropy)).toHex(0))
    long = long.shiftLeft(8).or(Long.Long.fromNumber(entropy));
    //console.log('unique_nonce_uint64 shift8\t',ByteBuffer.allocate(8).writeUint64(long).toHex(0))
    return long.toString();
};

function encryptBTSmemo(private_key, memoToPubKey, memo, usePrefix) {
    var memo_object = null;
    try {
        private_key = toPrivateObj(private_key);
        const memoFromPubKey = private_key.toPublicKey().toString();
        const nonce = unique_nonce_uint64();
        const message = Aes.encrypt_with_checksum(private_key, memoToPubKey, nonce, memo).toString('hex');
        memo_object = { from: memoFromPubKey, 
                        to: memoToPubKey, 
                        nonce: nonce, 
                        message: message 
                    };
    } catch (e) { alert(e); }
    return memo_object;
}

export default encryptBTSmemo;