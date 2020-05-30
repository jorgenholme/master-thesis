import asyncio
from hfc.fabric_ca.caservice import CAClient, CAService
from hfc.fabric import Client
from hfc.fabric_network import wallet
from hfc.fabric.transaction.tx_proposal_request import create_tx_prop_req, CC_INVOKE, CC_TYPE_NODE, CC_INSTANTIATE, CC_INSTALL, TXProposalRequest

loop = asyncio.get_event_loop()

cli = Client(net_profile="connection-profile3.json")
# NlClient = cli.get_user('netherlands.nl', 'user1Nl')

fs_wallet = wallet.FileSystenWallet("./tmp/hfc-kvs") # Opens wallet at ./tmp/hfc-kvs
user1Nl = fs_wallet.create_user("user1Nl", "Netherlands", "NetherlandsMSP") # Returns an instance of the user object with the newly created credentials

# Make the client know there is a channel in the network
cli.new_channel('common')

# Invoke a chaincode
args = []

# The response should be true if succeed
response = loop.run_until_complete(cli.chaincode_invoke(
               requestor=user1Nl,
               channel_name='common',
               peers=['peer0.netherlands.nl'],
               args=args,
               cc_name='very-simple',
               cc_type=CC_TYPE_NODE,
               transient_map=None, # optional, for private data
               wait_for_event=True # for being sure chaincode invocation has been commited in the ledger, default is on tx event
               #cc_pattern='^invoked*' # if you want to wait for chaincode event and you have a `stub.SetEvent("invoked", value)` in your chaincode
               ))
print(response)

# # Query a chaincode
# args = []
# # The response should be true if succeed
# response = loop.run_until_complete(cli.chaincode_query(
#                requestor=user1Nl,
#                channel_name='common',
#                peers=['peer0.netherlands.nl'],
#                args=args,
#                cc_name='access-chaincode'
#                ))
# print(response)