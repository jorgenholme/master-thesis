const { Gateway, FileSystemWallet, Transaction } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {

        let ccp = JSON.parse(fs.readFileSync('connection-profile.json', 'utf8'));
        const user = "AdminStavanger";

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


        // var cryptoSuite = Client.newCryptoSuite();
        // cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({ path: '/tmp' }));
        // client.setCryptoSuite(cryptoSuite);
        // const pathCert = path.resolve('/Users/mtng/go1.10/src/github.com/hf-dev/hyperledgerfabrictestnet/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem')

        // const pathKey = path.resolve('/Users/mtng/go1.10/src/github.com/hf-dev/hyperledgerfabrictestnet/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/0d0ed5f38a1084b1ca12d0836c0e4b011e8a97ca93d919a9d4d4275b147b3e30_sk')
        // let cert = fs.readFileSync(pathCert)
        // let pk = fs.readFileSync(pathKey)


        const channel = client.getChannel('common')
        const netherlandsPeers = client.getPeersForOrg('NetherlandsMSP')
        const spainPeers = client.getPeersForOrg('SpainMSP')
        const stavangerPeers = client.getPeersForOrg('StavangerMSP')
        const targets = netherlandsPeers.concat(stavangerPeers).concat(spainPeers);

        await channel.initialize({ discover: false })
        
        const collectionsConfigPath = "/home/jorgen/Documents/PIVT/fabric-kube/samples/chaincode/collection-definition.json";
        const tx_id = client.newTransactionID();

        const requestIntantiate = {
            targets: stavangerPeers,
            chaincodeId: 'access-chaincode',
            chaincodeType: 'node',
            chaincodeVersion: '1.0',
            fcn: 'Init',
            args: [],
            txId: tx_id,
            'collections-config': collectionsConfigPath

        };
        
        const resInst = await channel.sendInstantiateProposal(requestIntantiate);


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