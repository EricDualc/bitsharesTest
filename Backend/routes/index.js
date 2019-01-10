const {Apis} = require("bitsharesjs-ws");
var {Aes, PrivateKey} = require('bitsharesjs');

module.exports = (router) => {

	router.get('/account/:account_name', function(api_req, api_res) {
	  	var accountName = api_req.params.account_name;

        let server = "wss://bitshares.openledger.info/ws";

        Apis.instance(server, true).init_promise.then((res) => {
            Apis.instance().history_api().exec( "get_account_history", [ accountName, "1.11.0", 10, "1.11.0" ] ).then(response => {
              api_res.json({success: true, response});
            })
        });
  });
  
  function toPrivateObj(o) { return o ? o.d ? o : PrivateKey.fromWif(o) : o }

  function decryptBTSmemo(private_key, memo, usePrefix) {
      var msg = "";
      try {
          if (typeof memo != "object") memo = JSON.parse(memo);
          msg = memo.message;
          private_key = toPrivateObj(private_key);
          if (!private_key) throw new TypeError('private_key is required');
          const pubkey = private_key.toPublicKey().toString();
          const otherpub = pubkey === memo.from.toString() ? memo.to.toString() : memo.from.toString();
          msg = Aes.decrypt_with_checksum(private_key, otherpub, memo.nonce, memo.message).toString();
      } catch (e) { console.log(e); return null; }
      return msg;
    }

  router.post('/login', function(api_req, api_res) {
    var privateKey = api_req.body.private_key;
    var encryptedMEMO = api_req.body.encrypted_memo;
    var decryptedMEMO = decryptBTSmemo(privateKey, encryptedMEMO, 'BTS');
    if (decryptedMEMO == null) {
      api_res.json({success: false});  
    }
    api_res.json({success: true, decryptedMEMO});
});

	return router;
};