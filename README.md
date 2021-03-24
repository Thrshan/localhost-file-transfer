# File transfer with node.js

## Introduction
This repository is to transfer file from client pc or mobile devices to a host pc. Node.js server is deployed from the host device. The client devide can connect to ip v4 address of host device with port 3000 and transfer the file.

## Usage
Download and install [node.js](https://nodejs.org/en/).

Clone the repository
```bash
git clone https://github.com/Thrshan/localhost-file-transfer.git
```
or Download the zip and extract.

Install the dependencies 
```bash
npm i
```
Start the server
```bash
node .
```

Open another terminal and get the ip v4 address
```bash
ipconfig
```
Then the webapp can be accessed from any device conneced to the same network by visiting `192.xxx.xxx.xxx:3000`.

The transfered file will be saved in the uploads folder.


