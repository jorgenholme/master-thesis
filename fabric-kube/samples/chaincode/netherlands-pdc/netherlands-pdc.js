const shim = require('fabric-shim');

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
        const payload = await func(stub, funcAndPar.params);
        return shim.success(payload);
      } catch (err) {
        return shim.error(err);
      }

    }

    async putPrivateCollection(stub, args) {
      const cid = new shim.ClientIdentity(stub);
      const id = cid.getID();
      const result = args.result;

      await stub.putPrivateData('collectionNetherlandsStavanger', "1", Buffer.from(result));

      return "Success";
    }

};

module.exports = Chaincode;


      // if ( cid.assertAttributeValue("hf.role", "client") ) {
      //     const dateTime = new Date().toLocaleString();
      //     const id = cid.getID();
      //     const valToHash = dateTime.concat(id)

      //     const digest = crypto.createHash("sha256").update(valToHash).digest("hex")

      //  }