import socketserver
import sys
from Naked.toolshed.shell import execute_js, muterun_js

# From python docs https://docs.python.org/3.6/library/socketserver.html#examples
class MyTCPHandler(socketserver.BaseRequestHandler):
    """
    The request handler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        # self.request is the TCP socket connected to the client
        # Receive and strip the OTC
        # Receive the public key
        self.otc = self.request.recv(1024).strip()
        self.request.sendall(b'Received OTC')

        self.pubkey = self.request.recv(1024)
        self.request.sendall(b'Received public key')

        # print("{} wrote:".format(self.client_address[0]))
        # print((self.otc).decode('utf-8'))

        print("Querying the ledger.")
        response = muterun_js('/fabric-scripts/invokeChaincode/queryNetherlands.js')
        if response.exitcode == 0:
            print("Successfully queried chaincode")
        else:
            print("Unsuccessfully queried chaincode")
            sys.stderr.write(response.stderr)
            return
        

        ledger_otc = (response.stdout).decode('utf-8').replace('\n', '')
        user_otc = self.otc.decode('utf-8')
        self.otc = ""

        # print("self.OTC:", user_otc)
        # print("ledger_otc:", ledger_otc)
        # If the OTC matches the OTC on the ledger, add it to the authorized_keys file.
        if user_otc == ledger_otc:
            self.request.sendall(b'Access granted \n \t Adding public key to authorized_keys')

            # Open the authorized_keys file in write mode.
            # Decode the received key and write it to the file.
            with open ("/root/.ssh/authorized_keys", "w") as pub_file:
                print("{}".format(self.pubkey.decode('utf-8')), file=pub_file)
            self.pubkey = ""
            
        else:
            self.request.sendall(b'Access denied \n \t Incorrect OTC')
        




if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 30001

    # Create the server, binding to localhost on port 30001
    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)

    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C
    server.serve_forever()


# pub_key = RSA.importKey(self.pubkey, passphrase=None)
# pub_key.publickey().exportKey(format='PEM', passphrase=None, pkcs=1)