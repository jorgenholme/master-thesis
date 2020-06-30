'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet } = require('fabric-network');
const path = require('path');

const fixtures = "/home/jorgen/Documents/PIVT/fabric-kube/samples/ansible-network"

async function main() {

    // Main try/catch block
    try {

        // A wallet stores a collection of identities
        const wallet = new FileSystemWallet('wallet');

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, 'crypto-config/peerOrganizations/netherlands.nl/users/User1@netherlands.nl');
        const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@netherlands.nl-cert.pem')).toString();
        const privateKeyName = fs.readdirSync(path.join(credPath, '/msp/keystore/'));
        const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/'.concat(privateKeyName[0]))).toString();

        // Load credentials into wallet
        const identityLabel = 'User1';

        const identity = {
            certificate: certificate,
            privateKey: privateKey,
            mspId: 'NetherlandsMSP',
            type: 'X.509'
        }

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});