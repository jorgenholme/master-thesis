'use strict';

const { Gateway, FileSystemWallet } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        let ccp = JSON.parse(fs.readFileSync('../connection-profile.json', 'utf8'));
        const user = "AdminNetherlands";

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

        var pData;
        const outputPath = '/hadoop_job/job_files/job_data/output/';
        const pDataFiles = fs.readdirSync(outputPath);
        var index = pDataFiles.indexOf('_SUCCESS');
        if (index !== -1) pDataFiles.splice(index, 1);
        if (pDataFiles.length === 1) {
            pData = fs.readFileSync(path.join(outputPath, pDataFiles[0])).toString();
        } else {
            return "Error reading output file";
        }
        
        const result = await contract.submitTransaction('putPrivateNetherlandsCollection', pData);
        console.log(result.toString())
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();