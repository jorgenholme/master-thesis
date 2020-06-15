const shim = require('fabric-shim');
const Chaincode = require('./access-chaincode');

shim.start(new Chaincode());
