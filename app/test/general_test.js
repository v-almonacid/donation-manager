/*
 * A custom script for testing the chaincode
 */

'use strict';

const assert = require('chai').assert;

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
const gateway = new Gateway();

// TODO
// beforeEach(async function() {
//     await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
//     const network = await gateway.getNetwork('mychannel');
//     const contract = network.getContract('donationscc');
// });

// afterEach(async function() {
//     await gateway.disconnect();
// });

it('should check user1 exists', async() => {
    const userExists = await wallet.exists('user1');
    assert.equal(userExists, true);
});

it('should retrieve a single donation registered in the ledger', async () => {
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('donationscc');
    let result = await contract.evaluateTransaction('queryDonation', 'DON0');
    let resultAsJson = JSON.parse(JSON.parse(result));
    assert.equal(resultAsJson.project_id, 'PRO0');
    await gateway.disconnect();
});

it('should retrieve a all donations registered in the ledger', async () => {
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('donationscc');
    let result = await contract.evaluateTransaction('queryAllDonations');
    let resultAsJson = JSON.parse(JSON.parse(result));
    assert.isAbove(resultAsJson.length, 0); // there should be at least one entry in the ledger
    await gateway.disconnect();
});

it('should add a new donation in the ledger', async () => {
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('donationscc');
    await contract.submitTransaction('addDonation', 'DON2', 'PRO1', 'ITEM1', '2');
    let result = await contract.evaluateTransaction('queryDonation', 'DON2');
    let resultAsJson = JSON.parse(JSON.parse(result));
    assert.equal(resultAsJson.project_id, 'PRO1');
    assert.equal(resultAsJson.item_id, 'ITEM1');
    await gateway.disconnect();
});
