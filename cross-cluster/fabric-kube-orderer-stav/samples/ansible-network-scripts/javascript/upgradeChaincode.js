const { Gateway, FileSystemWallet, Transaction } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {

        let ccp = JSON.parse(fs.readFileSync('connection-profile.json', 'utf8'));
        const user = "AdminNetherlands";

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

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

        let client = gateway.getClient();
        
        const netherlandsPeers = client.getPeersForOrg('NetherlandsMSP');
        const spainPeers = client.getPeersForOrg('SpainMSP');
        const stavangerPeers = client.getPeersForOrg('StavangerMSP');
        const targets = netherlandsPeers.concat(stavangerPeers).concat(spainPeers);

        let installResponse = await client.installChaincode({
            targets: targets,
            chaincodePath: '/home/jorgen/Documents/PIVT/fabric-kube/samples/chaincode/access-chaincode',
            chaincodeId: 'access-chaincode',
            chaincodeVersion: '2.0',
            chaincodeType: 'node',
            channelNames: ['common']
        });

        const channel = client.getChannel('common')
        

        await channel.initialize({ discover: false })
        
        const collectionsConfigPath = "/home/jorgen/Documents/PIVT/fabric-kube/samples/chaincode/collection-definition.json";
        const tx_id = client.newTransactionID();

        console.log(installResponse)

        const requestUpgrade = {
            chaincodeId: 'access-chaincode',
            chaincodeType: 'node',
            chaincodeVersion: '2.0',
            fcn: 'Init',
            args: [],
            txId: tx_id,
            'collections-config': collectionsConfigPath

        };
        
        const resInst = await channel.sendUpgradeProposal(requestUpgrade);


        const transactionResponse = await channel.sendTransaction({
            proposalResponses: resInst[0],
            proposal: resInst[1]
        });

        console.log(transactionResponse)

        channel.close()
        gateway.disconnect()




    } catch (error) {
        console.error(`Error: ${error}`);

        process.exit(1);
    }
}

main();