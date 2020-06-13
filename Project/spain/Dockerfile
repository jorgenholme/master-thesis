FROM ubuntu:18.04
EXPOSE 5003 22 30001

RUN apt update 
RUN apt install -y ssh 
RUN apt install -y python3-pip 
RUN pip3 install Naked 
RUN apt install -y nodejs 
RUN apt install -y npm

# Make directories for ssh and authorized keys
RUN mkdir root/.ssh
RUN chmod 700 root/.ssh
RUN touch root/.ssh/authorized_keys
RUN chmod 600 root/.ssh/authorized_keys

# Put public ssh key into authorized keys
# COPY ssh/id_rsa.pub root/.ssh/authorized_keys

COPY putPDCInvoke.js /PDC/

# Start ssh service
ENTRYPOINT service ssh start && bash
