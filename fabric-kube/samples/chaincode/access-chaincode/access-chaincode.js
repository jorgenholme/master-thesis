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
        const payload = await func(stub, funcAndPar.params);
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

    async accessResults(stub) {
      const cid = new shim.ClientIdentity(stub);
      const userId = cid.getID();
      // const num1 = args.netherlandsNum;
      // const num2 = args.spainNum;

      const payload1 = await stub.getPrivateData('collectionNetherlandsStavanger', '1');
      const payload2 = await stub.getPrivateData('collectionSpainStavanger', '1');

      const payload1String = payload1.toString();
      const payload2String = payload2.toString();

      const payload = payload1String.concat(payload2String);

      return Buffer.from(payload);
    }


    async putPrivateNetherlandsCollection(stub, args) {
      // const cid = new shim.ClientIdentity(stub);
      // const id = cid.getID();
      const result = args[0];

      await stub.putPrivateData('collectionNetherlandsStavanger', '1', Buffer.from(result));

      return Buffer.from(result.toString());
    }


    async putPrivateSpainCollection(stub, args) {
      // const cid = new shim.ClientIdentity(stub);
      // const id = cid.getID();
      const result = args[0];

      await stub.putPrivateData('collectionSpainStavanger', '1', Buffer.from(result));

      return Buffer.from(result.toString());
    }

    // async pull(stub) {
    //   const payloadOrg2 = stub.invokeChaincode('accessOrg2');
    //   const payloadOrg3 = stub.invokeChaincode('accessOrg3');

    //   const payload = [payloadOrg2, payloadOrg3];

    //   return payload;
    // }

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