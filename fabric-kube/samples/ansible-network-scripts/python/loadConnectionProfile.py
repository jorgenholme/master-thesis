from hfc.fabric import Client
import yaml

cli = Client(net_profile="connection-profile.json")

print(cli.organizations)  # orgs in the network
print(cli.peers)  # peers in the network
print(cli.orderers)  # orderers in the network
print(cli.CAs)  # ca nodes in the network