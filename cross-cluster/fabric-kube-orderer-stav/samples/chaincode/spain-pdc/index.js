const shim = require('fabric-shim');
const Chaincode = require('./spain-pdc');

shim.start(new Chaincode());
