const mongoose = require('mongoose');
const path = require('path');

const config = require('../utils/config');
const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const testMongoDBURL = 'mongodb+srv://tengtjinyang:zagNwPsta2HHTyfE@transferconnect.0papjri.mongodb.net/TransferConnectDB';

// async function createNewCollection(
//     mongoDBURL,
//     collectionName,
//     schema,
//     data
// ) { 
//     // Creating new collection
//     const newCollection = mongoose.model(collectionName, schema);

//     try {
//         await mongoose.connect(mongoDBURL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         for (let row in data) {
//             const newDoc = new newCollection({
                
//             })}

//     } catch (error) {
//         console.log(error);
//     }
//     await newCollection.createCollection();

//     // Inserting the data into collection



//     mongoose.connection.close();
// };

// createNewCollection(
//     testMongoDBURL,
//     'testCollection',
//     transactionEnquiryModel
// )

class CreateMongoDBCollection {

    constructor() {
        this.collectionName = 'newCollection';
        this.schema = transactionEnquiryModel;
    };
    
    mockData = [
        {
          _id: "649fb6ad87d672d8f30e98e5",
          transferDate: "2023-07-23",
          referenceNumber: "3av456b",
          partnerCode: "DBSSG",
          membershipId: "2342345bc",
          memberName: "Thomas Doe",
          transferAmount: 100000,
          outcomeCode: "0002"
        },
        {
          _id: "759fb6ad87d672d8f30e99b6",
          transferDate: "2023-07-23",
          referenceNumber: "4bx456c",
          partnerCode: "HSBC",
          membershipId: "1231235cd",
          memberName: "Jane Doe",
          transferAmount: 200000
        },
        {
          _id: "869fb6ad87d672d8f30e99d8",
          transferDate: "2023-07-24",
          referenceNumber: "6dy456e",
          partnerCode: "HSBC",
          membershipId: "8908908ij",
          memberName: "Jane Smith",
          transferAmount: 350000
        },
        {
          _id: "879fb6ad87d672d8f30e99e9",
          transferDate: "2023-07-23",
          referenceNumber: "7ez456f",
          partnerCode: "DBSSG",
          membershipId: "9109109kl",
          memberName: "John Doe",
          transferAmount: 400000
        }
    ];

    createNewCollection = async () => {
        // Creating new collection
        const newCollection = mongoose.model(this.collectionName, this.schema);

        try {
            for (let row of this.mockData) {
                console.log('row: ',row)
                const newDoc = new newCollection({
                    membershipId: row.membershipId,
                    memberName: row.memberName,
                    transferDate: row.transferDate,
                    transferAmount: row.transferAmount,
                    referenceNumber: row.referenceNumber,
                    partnerCode: row.partnerCode,
                    outcomeCode: row.outcomeCode,
                    notificationMethod: row.notificationMethod,
                    emailAddress: row.emailAddress,
                    phoneNumber: row.phoneNumber,
                    systemId: row.systemId
                });
                await newDoc.save();
                console.log("Data uploaded: ", newDoc)
            };

        } catch (error) {
            console.log(error);
        }
        await newCollection.createCollection();
        mongoose.connection.close();
        // Inserting the data into collection
        
    }

};

const createMongoDBCollection = new CreateMongoDBCollection();
module.exports = createMongoDBCollection;