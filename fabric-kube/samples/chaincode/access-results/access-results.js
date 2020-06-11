const shim = require('fabric-shim');
const crypto = require('crypto');

const Chaincode = class {

    async Init() {
        return shim.success();
    }


    async Invoke(stub) {
      
      const funcAndPar = stub.getFunctionAndParameters();
      const func = this[funcAndPar.fcn];

      if (!func) {
        return shim.error(`Received unknown function ${funcAndPar.fcn} invocation`);
      }

      try {
        const payload = await func(stub);
        return shim.success(payload);
      } catch (err) {
        return shim.error(err);
      }

    }

    async accessResults(stub) {
      const cid = new shim.ClientIdentity(stub);
      const userId = cid.getID();
      const num1 = args.netherlandsNum;
      const num2 = args.spainNum;

      const payload1 = await stub.getPrivateData('collectionNetherlandsStavanger', "1");
      const payload2 = await stub.getPrivateData('collectionSpainStavanger', "1");

      const payload = [payload1, payload2];

      return payload;
    }

};

module.exports = Chaincode;

      // if ( cid.assertAttributeValue("hf.role", "client") ) {
      //     const dateTime = new Date().toLocaleString();
      //     const id = cid.getID();
      //     const valToHash = dateTime.concat(id)

      //     const digest = crypto.createHash("sha256").update(valToHash).digest("hex")

      //  }