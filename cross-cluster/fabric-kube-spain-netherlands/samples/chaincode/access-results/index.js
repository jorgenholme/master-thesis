const shim = require('fabric-shim');
const Chaincode = require('./access-results');

shim.start(new Chaincode());
