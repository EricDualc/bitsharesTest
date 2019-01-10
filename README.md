#BitShares Test Project

##Node.js backend

port:4002

##React.js frontend

port:3000

##Important

BitsharesJS use `GPH` as default publickey prefix so need to add following code before the definition of publickey function in `node_modules/bitsharesjs/dist/ecc/src/PublicKey.js`
`_bitsharesjsWs.ChainConfig.address_prefix = 'BTS';`
