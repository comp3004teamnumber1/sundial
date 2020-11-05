#!/bin/bash

read -p "Install python dependencies?: [y/n] " python_dependencies
read -p "Install pip dependencies?: [y/n] " pip_dependencies

# install dependencies
if [ "$python_dependencies" == "y" ]; then
    sudo apt install python3 python3-pip -y
fi

# install pipenv
if [ "$pip_dependencies" == "y" ]; then
    sudo pip3 install pipenv
fi

# install dependencies
pipenv install

# run the server
pipenv run python3 ./server.py