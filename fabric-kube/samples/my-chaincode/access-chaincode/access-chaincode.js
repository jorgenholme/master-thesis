// const { Contract }=require("fabric-contract-api");
// const crypto = require("crypto");
const shim = require('fabric-shim');

const Chaincode = class {

    async Init() {
        return shim.success();
    }


    async Invoke(stub) {

        // let cid = new shim.ClientIdentity(stub);


        // const dateTime = new Date().toLocaleString();
        // const uid = cid.getID();
        // const valToHash = dateTime.concat(uid)

        // const digest = crypto.createHash("sha256").update(valToHash).digest("hex")
        const digest = "hei";
        const key = "hehe";

        await stub.putState(key, Buffer.from(digest));

        return shim.success(Buffer.from(digest.toString()))



        // if ( cid.assertAttributeValue("hf.role", "client") ) {
        //     const dateTime = new Date().toLocaleString();
        //     const id = cid.getID();
        //     const valToHash = dateTime.concat(id)

        //     const digest = crypto.createHash("sha256").update(valToHash).digest("hex")

        //  }

      }

    // async produceOTC(ctx, clientId) {
    //     console.info("============ START: Create OTC ============")
        
    //     // Concatinate the current datetime and the clientId
    //     dateTime = new Date().toLocaleString()
    //     valToHash = dateTime.concat(String(clientId))


    //     // Hash the value to create a one-time-code
    //     digest = crypto.createHash("sha256").update(valToHash).digest("hex")



    //     const otc = {
    //         client: clientId,
    //         otc: digest
    //     };

    //     // Commit state change to ledger
    //     await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(otc)));
        

    //     console.info("============ END: Create OTC ============")

    //     return digest
    // }


    // async queryOTC(ctx, clientId) {
    //     let otc = await ctx.stub.getState(clientId);

    //     if (!otc || otc.length === 0) {
    //         throw new Error(`${clientId} does not exist`);
    //     }

    //     console.log(otc.toString())
    //     return otc.toString()
    // }


};

module.exports = Chaincode;