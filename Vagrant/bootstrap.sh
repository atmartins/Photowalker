#!/usr/bin/env bash

# ------------------------------------------------
# Project Name, set in Vagrantfile
# ------------------------------------------------
projectName=$1

# ------------------------------------------------
# Update the box release repositories
# ------------------------------------------------
echo '***************************** Setting up needed Repos *****************************'
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10


echo '***************************** Apt Update *****************************'
export DEBIAN_FRONTEND=noninteractive
apt-get update


echo '***************************** System settings *****************************'

# Terminal
echo "PS1='$projectName(\u):\w# ' " >> /root/.bashrc
echo "PS1='$projectName(\u):\w\$ ' " >> /home/vagrant/.bashrc

echo "***************************** Installing Packages needed to build under PECL *****************************"
apt-get install -y build-essential git curl g++ libssl-dev

echo '***************************** Installing and configuring Node and NPM *****************************'
curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y nodejs

echo '***************************** Installing exiftool *****************************'
apt-get install libimage-exiftool-perl
echo '***************************** Installing usbmount *****************************'
apt-get install usbmount