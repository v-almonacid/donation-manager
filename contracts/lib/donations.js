/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Donations extends Contract {

    async initLedger(ctx) {

        // initialize ledger with default data
        const donations = [
            {
                project: 'Healthcare for Refugees',
                item: 'diphteria vaccine',
                amount: 100
            },
        ];

        for (let i = 0; i < donations.length; i++) {
            donations[i].docType = 'donation';
            await ctx.stub.putState('DON' + i, Buffer.from(JSON.stringify(donations[i])));
            console.info('Added <--> ', donations[i]);
        }
    }

    async addDonation(ctx, donationId, project, itemType, amount) {
      // TODO: timestamp
      let donation = {
          project,
          itemType,
          amount,
          docType: 'project',
      };
      await ctx.stub.putState(donationId, Buffer.from(JSON.stringify(donation)));
    }

    async queryDonation(ctx, donationId) {
        const donationAsBytes = await ctx.stub.getState(donationId); // get the project from chaincode state
        if (!donationAsBytes || donationAsBytes.length === 0) {
            throw new Error(`${donationId} does not exist`);
        }
        console.log(donationAsBytes.toString());
        return donationAsBytes.toString();
    }

    async queryAllDonations(ctx) {
        const startKey = 'DON0';
        const endKey = 'DON999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

}

module.exports = MyTestCc;
