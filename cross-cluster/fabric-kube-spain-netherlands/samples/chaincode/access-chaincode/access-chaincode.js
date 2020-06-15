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

    async grantSpainAccess(stub) {
      const cid = new shim.ClientIdentity(stub);

      const dateTime = new Date().toLocaleString();
      const userId = cid.getID();
      const valToHash = dateTime.concat(userId);
      const digest = crypto.createHash("sha256").update(valToHash).digest("hex");

      await stub.putState("Spain", Buffer.from(digest));

      const payload = Buffer.from(digest.toString());

      return payload;
    }

    async grantNetherlandsAccess(stub) {
      const cid = new shim.ClientIdentity(stub);

      const dateTime = new Date().toLocaleString();
      const userId = cid.getID();
      const valToHash = dateTime.concat(userId);
      const digest = crypto.createHash("sha256").update(valToHash).digest("hex");

      await stub.putState("Netherlands", Buffer.from(digest));

      const payload = Buffer.from(digest.toString());

      return payload;
    }

    async accessResults(stub) {
      const payload1 = await stub.getPrivateData('collectionNetherlandsStavanger', 'result');
      const payload2 = await stub.getPrivateData('collectionSpainStavanger', 'result');

      const result1 = payload1.toString();
      const result2 = payload2.toString();

      const nSplit1 = (result1.split("\n"));
      const tSplit1 = [];
      const obj1 = {};

      for (let i=0; i < nSplit1.length; i++){
          tSplit1.push(nSplit1[i].split("\t"));
          if (Number.isNaN(parseInt(tSplit1[i][1]))) {
              continue;
          }
          obj1[tSplit1[i][0]] = parseInt(tSplit1[i][1]);
      }

      const nSplit2 = (result2.split("\n"));
      const tSplit2 = [];
      const obj2 = {};

      for (let i=0; i < nSplit2.length; i++){
          tSplit2.push(nSplit2[i].split("\t"));
          if (Number.isNaN(parseInt(tSplit2[i][1]))) {
              continue;
          }
          obj2[tSplit2[i][0]] = parseInt(tSplit2[i][1]);
      }

      const mergedObj = {};
      const keys2 = Object.keys(obj2);

      for (let i=0; i < keys2.length; i++){
          var key = keys2[i];
          if (key in obj1) {
              mergedObj[key] = obj1[key] + obj2[key];
          } else {
              mergedObj[key] = obj2[key];
          }
      }

      const keys1 = Object.keys(obj1);
      for (let i=0; i < keys1.length; i++){
          var key = keys1[i];
          if (!(keys1[i] in obj2)) {
              mergedObj[key] = obj1[key]
          } else {
              continue;
          }
      }

      const payload = JSON.stringify(mergedObj);

      return Buffer.from(payload);
    }


    async putPrivateNetherlandsCollection(stub, args) {
      const result = args[0];

      await stub.putPrivateData('collectionNetherlandsStavanger', 'result', Buffer.from(result));

      return Buffer.from(result.toString());
    }


    async putPrivateSpainCollection(stub, args) {
      const result = args[0];

      await stub.putPrivateData('collectionSpainStavanger', 'result', Buffer.from(result));

      return Buffer.from(result.toString());
    }

    
    async querySpain(stub) {
      const otc = await stub.getState("Spain");
      if (!otc || otc.length === 0) {
        throw new Error('OTC does not exist');
      }

      const payload = Buffer.from(otc.toString());

      return payload;
    }

    async queryNetherlands(stub) {
      const otc = await stub.getState("Netherlands");
      if (!otc || otc.length === 0) {
        throw new Error('OTC does not exist');
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