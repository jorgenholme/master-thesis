from hfc.fabric_network import wallet
from hfc.fabric_ca.caservice import CAClient, CAService

# Netherlands user
casvc = CAService(target="http://192.168.39.246:31700")
adminNlEnrollment = casvc.enroll("admin", "adminpw") # now local will have the admin enrollment
secret = adminNlEnrollment.register("user1Nl") # register a user to ca
user1NlEnrollment = casvc.enroll("user1Nl", secret) # now local will have the user enrollment
new_wallet = wallet.FileSystenWallet() # Creates default wallet at ./tmp/hfc-kvs
user_identity_nl = wallet.Identity("user1Nl", user1NlEnrollment) # Creates a new Identity of the enrolled user
user_identity_nl.CreateIdentity(new_wallet) # Stores this identity in the FileSystemWallet
user1Nl = new_wallet.create_user("user1Nl", "Netherlands", "NetherlandsMSP") # Returns an instance of the user object with the newly created credentials


# # Spain user
# casvc = CAService(target="http://172.17.0.2:31701")
# adminEsEnrollment = casvc.enroll("admin", "adminpw") # now local will have the admin enrollment
# secret = adminEsEnrollment.register("user1Es") # register a user to ca
# user1EsEnrollment = casvc.enroll("user1Es", secret) # now local will have the user enrollment
# # new_wallet = wallet.FileSystenWallet() # Creates default wallet at ./tmp/hfc-kvs
# user_identity_es = wallet.Identity("user1Es", user1EsEnrollment) # Creates a new Identity of the enrolled user
# user_identity_es.CreateIdentity(new_wallet) # Stores this identity in the FileSystemWallet
# user1Es = new_wallet.create_user("user1Es", "Spain", "SpainMSP") # Returns an instance of the user object with the newly created credentials

