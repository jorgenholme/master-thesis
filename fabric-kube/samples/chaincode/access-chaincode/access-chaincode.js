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

    async grantAccess(stub) {
      const cid = new shim.ClientIdentity(stub);

      const dateTime = new Date().toLocaleString();
      const userId = cid.getID();
      const valToHash = dateTime.concat(userId);
      const digest = crypto.createHash("sha256").update(valToHash).digest("hex");

      await stub.putState(userId, Buffer.from(digest));

      const payload = Buffer.from(digest.toString());

      return payload;
    }

    async query(stub) {
      const cid = new shim.ClientIdentity(stub);

      const userId = cid.getID();
      const otc = await stub.getState(userId);
      if (!otc || otc.length === 0) {
        throw new Error(`${userId} does not exist`);
      }

      const payload = Buffer.from(otc.toString());

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