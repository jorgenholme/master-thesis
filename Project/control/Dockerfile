# FROM ubuntu-upstart:14.04
# EXPOSE 5001 22

# #Install ansible, ping, vim and git
# RUN apt-get update && \
# apt-get -y install software-properties-common

# RUN apt-add-repository --yes ppa:ansible/ansible && \
# apt-get update && \
# apt-get -y install ansible && \
# apt-get -y install iputils-ping && \
# apt-get -y install vim && \ 
# apt-get -y install git

# # Make directories for ssh key, and generate a public key.
# RUN mkdir root/.ssh
# RUN chmod 700 root/.ssh

# # Copy private and public ssh key into ~/.ssh/
# COPY ssh/id_rsa root/.ssh
# COPY ssh/id_rsa.pub root/.ssh

# # Change permission to 600 for private key
# RUN chmod 600 /root/.ssh/id_rsa

#############################################################
FROM ubuntu:18.04
EXPOSE 5004 22

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN apt install -y ssh

# Install ansible and utils
RUN apt-add-repository --yes ppa:ansible/ansible && \
apt update && \
apt -y install ansible && \
apt -y install iputils-ping && \
apt -y install vim 

RUN apt -y install nodejs
RUN apt -y install npm

# Make directories for ssh key.
RUN mkdir root/.ssh
RUN chmod 700 root/.ssh

# Copy private and public ssh key into ~/.ssh/
COPY ssh/id_rsa root/.ssh
COPY ssh/id_rsa.pub root/.ssh

# Change permission to 600 for private key
RUN chmod 600 /root/.ssh/id_rsa

# Start ssh service
ENTRYPOINT service ssh start && bash