./init.sh samples/ansible-network/ samples/chaincode/ false
az aks get-credentials --resource-group hlf-thesis --name hlf-network
cd ../fabric-kube-spain-netherlands/

./init.sh samples/ansible-network/ samples/chaincode/ false

az aks get-credentials --resource-group hlf-thesis --name hlf-orderer-stav
cd ../fabric-kube-orderer-stav/
cp -r ../fabric-kube-spain-netherlands/hlf-kube/crypto-config/peerOrganizations/netherlands.nl/msp/* hlf-kube/crypto-config/peerOrganizations/netherlands.nl/msp/
cp -r ../fabric-kube-spain-netherlands/hlf-kube/crypto-config/peerOrganizations/spain.es/msp/* hlf-kube/crypto-config/peerOrganizations/spain.es/msp/

cd hlf-kube/
configtxgen -profile OrdererGenesis -channelID ansiblenetwork -outputBlock ./channel-artifacts/genesis.block
cd ..
cp hlf-kube/channel-artifacts/genesis.block ../fabric-kube-spain-netherlands/hlf-kube/channel-artifacts/

helm install ./hlf-kube --name hlf-kube-orderer-stav -f samples/ansible-network/network.yaml -f samples/ansible-network/crypto-config.yaml --set peer.launchPods=false --set orderer.launchPods=false --set peer.externalService.enabled=true --set orderer.externalService.enabled=true

az aks get-credentials --resource-group hlf-thesis --name hlf-network
cd ../fabric-kube-spain-netherlands/

helm install ./hlf-kube --name hlf-kube-spain-netherlands -f samples/ansible-network/network.yaml -f samples/ansible-network/crypto-config.yaml --set peer.launchPods=false --set orderer.launchPods=false --set peer.externalService.enabled=true --set orderer.externalService.enabled=true
