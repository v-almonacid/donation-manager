/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const projects = [
    {
        id: "PRO0",
        name: "healthcare for refugees",
        organization: "red cross",
    },
    {
        id: "PRO1",
        name: "school reconstruction program",
        organization: "onu",
    }
];

const itemTypes = [
    {
        id: "ITEM0",
        name: "diphteria vaccine",
        unit_cost: 100,
    },
    {
        id: "ITEM1",
        name: "construction toolkit",
        unit_cost: 10,
    }
]

class Donation extends Contract {

    async initLedger(ctx) {

        // initialize ledger with default data
        const donations = [
            {
                project_id: 'PRO0',
                item_id: 'ITEM0',
                amount: 100,
                timestamp: Date.now()
            },
        ];

        for (let i = 0; i < donations.length; i++) {
            donations[i].docType = 'donation';
            await ctx.stub.putState('DON' + i, Buffer.from(JSON.stringify(donations[i])));
            console.info('Added <--> ', donations[i]);
        }
    }

    /**
     * Adds a new donation to the ledger
     *
     * @param {Context} ctx the transaction context
     * @param {String} donationId donation identifier (eg. DON1)
     * @param {String} projectId id of the beneficiary project (eg. PRO1)
     * @param {String} itemId id of the item to be donated (eg. ITEM1)
     * @param {Integer} amount amount of units of the item to be donated
    */
    async addDonation(ctx, donationId, projectId, itemId, amount) {

        // check if the project id exists
        let projectMatch = projects.filter(
            function(projects){ return projects.id == projectId }
        );
        if (projectMatch.length === 0) {
            throw new Error(`The project does not exist`);
        }

        // check if the item id exists
        let itemMatch = itemTypes.filter(
            function(itemTypes){ return itemTypes.id == itemId }
        );
        if (itemMatch.length === 0) {
            throw new Error(`The item does not exist`);
        }

        let donation = {
            project_id: projectId,
            item_id: itemId,
            amount,
            timestamp: Date.now(),
            docType: 'donation',

        };
        await ctx.stub.putState(donationId, Buffer.from(JSON.stringify(donation)));
    }

    async queryDonation(ctx, donationId) {
        const donationAsBytes = await ctx.stub.getState(donationId);
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



module.exports = Donation;
