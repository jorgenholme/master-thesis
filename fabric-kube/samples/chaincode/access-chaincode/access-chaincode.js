// const { Contract }=require("fabric-contract-api");
// const crypto = require("crypto");
const shim = require('fabric-shim');

const Chaincode = class {

    async Init() {
        return shim.success();
    }


    async Invoke(stub) {
      

      let cid = new shim.ClientIdentity(stub);

      const dateTime = new Date().toLocaleString();
      const uid = cid.getID();
      const digest = dateTime.concat(uid);
    //   const digest = crypto.createHash("sha256").update(valToHash).digest("hex");

      await stub.putState(uid, Buffer.from(digest));

      return shim.success(Buffer.from(digest.toString()))

    
        
      // if ( cid.assertAttributeValue("hf.role", "client") ) {
      //     const dateTime = new Date().toLocaleString();
      //     const id = cid.getID();
      //     const valToHash = dateTime.concat(id)

      //     const digest = crypto.createHash("sha256").update(valToHash).digest("hex")

      //  }

      }

};

module.exports = Chaincode;