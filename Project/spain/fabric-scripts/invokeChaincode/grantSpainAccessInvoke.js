'use strict';

const { Gateway, FileSystemWallet } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        let ccp = JSON.parse(fs.readFileSync('../connection-profile.json', 'utf8'));
        const user = "AdminStavanger";

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '../wallet');
        const wallet = new FileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.export(user);
        if (!identity) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false, asLocalhost: true } });

        
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('common');


        // Get the contract from the network.
        const contract = network.getContract('access-chaincode');

        // Submit the specified transaction.
        
        const result = await contract.submitTransaction('grantSpainAccess');
        console.log(result.toString())
        console.log('Transaction has been submitted');

        fs.appendFile('spainOtc.txt', result.toString(), function (err) {
            if (err) {
              console.log("Writing to file failed.")
            } else {
              console.log("Wrote OTC to file at ./spainOtc.txt")
            }
          })

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();