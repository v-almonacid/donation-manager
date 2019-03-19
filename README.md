# donations-manager

Hyperledger Fabric sample chaincode to manage donations.

## Setup

### 1. Fork this repository
```
git clone git@github.com:v-almonacid/donations-manager.git
```
### 2. Install Hyperledger Fabric binaries
First, make sure you meet all Hyperledger Fabric dependencies listed
in the [prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html) page.

Then, within the project directory, enter:
```
curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.0 -s
```
This script will install the Hyperledger Fabric binaries and create two directories (`bin/` and `config/`). The `-s` option avoids cloning the fabric samples repository.

## Interacting with the Backend
Go to the `app/` folder and install node dependencies:
```
cd app/
npm install
```
Then, enroll the `admin` and register `user1`:
```
node enrollAdmin.js
node registerUser.js
```
You can now query the ledger to see the registered donations:
```
node query.js
```
You may also submit a new donation to the ledger using using the script `addDonation.js`:
```
node addDonation.js
```
Note that the donation parameters are hard-coded in the script.

## Testing
Assuming you have already deployed the chaincode over the basic network environment:
```
cd app/
npm run test
```

TODO:
  - Setup a proper (non-persistent) testing environment
