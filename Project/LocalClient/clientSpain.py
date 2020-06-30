import socket
import sys
import os

HOST, PORT = "spain", 30001
data = " ".join(sys.argv[1:]).split(" ")

otc_path, pub_key_path = data[0], data[1].strip()

# Create a socket (SOCK_STREAM means a TCP socket)
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    
    try:
        # Read the public key located at given path (~/.ssh/id_rsa.pub)
        with open(pub_key_path, 'r') as file:
            key = file.read().replace('\n', '')
    except:
        print("No public key found in that path.")

    try:
        # Read the OTC located at given path
        with open(otc_path, 'r') as file:
            otc = file.read().replace('\n', '')
    except:
        print("No OTC found in that path. Try invoking grantAccess first.")
    
    # Connect to server and send the OTC
    print("Connecting to server...")
    sock.connect((HOST, PORT))
    print("Connection established.")


    # Send OTC as a byte-like object
    sock.sendall(bytes(otc, "utf-8"))
    received = str(sock.recv(1024), "utf-8")
    print(received)


    # Send the key as a byte-like object
    sock.send(bytes(key, "utf-8"))
    received = str(sock.recv(1024), "utf-8")
    print(received)


    # Receive data from the server and shut down
    received = str(sock.recv(1024), "utf-8")
    print("Received data from server.")

print("Sent:    {}".format(otc))
print("Message: {}".format(received))
