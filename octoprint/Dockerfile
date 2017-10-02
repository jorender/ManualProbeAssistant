FROM ubuntu
RUN apt-get clean && apt-get -y update && apt-get -y install git virtualenv python2.7 python-pip python-dev build-essential

WORKDIR ~/
COPY init-octoprint.sh ~/init-octoprint.sh
ENTRYPOINT ~/init-octoprint.sh
