./collect_host_aliases.sh samples/ansible-network/
./collect_external_host_aliases.sh loadbalancer samples/ansible-network/

az aks get-credentials --resource-group hlf-thesis --name hlf-orderer-stav

cd ../fabric-kube-orderer-stav/
./collect_host_aliases.sh samples/ansible-network/
./collect_external_host_aliases.sh loadbalancer samples/ansible-network/

cat ../fabric-kube-spain-netherlands/samples/ansible-network/externalHostAliases.yaml >> ./samples/ansible-network/hostAliases.yaml

cd ../fabric-kube-spain-netherlands/

cat ../fabric-kube-orderer-stav/samples/ansible-network/externalHostAliases.yaml >> ./samples/ansible-network/hostAliases.yaml


cd ../fabric-kube-orderer-stav/

helm upgrade hlf-kube-orderer-stav ./hlf-kube -f samples/ansible-network/network.yaml -f samples/ansible-network/crypto-config.yaml -f samples/ansible-network/hostAliases.yaml --set peer.externalService.enabled=true --set orderer.externalService.enabled=true --set peer.launchPods=true --set orderer.launchPods=true

az aks get-credentials --resource-group hlf-thesis --name hlf-network

cd ../fabric-kube-spain-netherlands/

helm upgrade hlf-kube-spain-netherlands ./hlf-kube -f samples/ansible-network/network.yaml -f samples/ansible-network/crypto-config.yaml -f samples/ansible-network/hostAliases.yaml --set peer.externalService.enabled=true --set orderer.externalService.enabled=true --set peer.launchPods=true --set orderer.launchPods=true


