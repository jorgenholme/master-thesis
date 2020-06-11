const shim = require('fabric-shim');
const Chaincode = require('./netherlands-pdc');

shim.start(new Chaincode());
