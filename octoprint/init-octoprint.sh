#! /bin/bash
git clone https://github.com/foosel/OctoPrint.git  
cd OctoPrint

pip install --upgrade pip
pip install -e .[develop]

adduser --disabled-password octo
su - octo -c "octoprint serve"