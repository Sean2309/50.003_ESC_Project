const mongoose = require('mongoose');
const transactionEnquiryModel = require('../models/transactionEnquiryModel');

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
        outcomeCode: "0002",
        notificationMethod: 1,
        emailAddress: "thomasdoe@email.com",
        phoneNumber: "+1234567890",
        systemId: "system1234"
      },
      {
        _id: "759fb6ad87d672d8f30e99b6",
        transferDate: "2023-07-23",
        referenceNumber: "4bx456c",
        partnerCode: "HSBC",
        membershipId: "1231235cd",
        memberName: "Jane Doe",
        transferAmount: 200000,
        outcomeCode: "0001",
        notificationMethod: 2,
        emailAddress: "janedoe@email.com",
        phoneNumber: "+0987654321",
        systemId: "system5678"
      },
      {
        _id: "869fb6ad87d672d8f30e99d8",
        transferDate: "2023-07-24",
        referenceNumber: "6dy456e",
        partnerCode: "HSBC",
        membershipId: "8908908ij",
        memberName: "Jane Smith",
        transferAmount: 350000,
        outcomeCode: "0002",
        notificationMethod: 1,
        emailAddress: "janesmith@email.com",
        phoneNumber: "+1112223333",
        systemId: "system9101"
      },
      {
        _id: "879fb6ad87d672d8f30e99e9",
        transferDate: "2023-07-23",
        referenceNumber: "7ez456f",
        partnerCode: "DBSSG",
        membershipId: "9109109kl",
        memberName: "John Doe",
        transferAmount: 400000,
        outcomeCode: "0001",
        notificationMethod: 2,
        emailAddress: "johndoe@email.com",
        phoneNumber: "+4445556666",
        systemId: "system1213"
      },
      {
        _id: "949fb6ad87d672d8f30e98e6",
        transferDate: "2023-07-24",
        referenceNumber: "8fv456g",
        partnerCode: "UOB",
        membershipId: "3453456dd",
        memberName: "Samuel Doe",
        transferAmount: 500000,
        outcomeCode: "0002",
        notificationMethod: 1,
        emailAddress: "samueldoe@email.com",
        phoneNumber: "+5678901234",
        systemId: "system3456"
      },
      {
        _id: "109fb6ad87d672d8f30e99c7",
        transferDate: "2023-07-24",
        referenceNumber: "9gw456h",
        partnerCode: "CITI",
        membershipId: "4564567ee",
        memberName: "Richard Roe",
        transferAmount: 600000,
        outcomeCode: "0001",
        notificationMethod: 2,
        emailAddress: "richardroe@email.com",
        phoneNumber: "+7890123456",
        systemId: "system7890"
      },
      {
        _id: "119fb6ad87d672d8f30e99f8",
        transferDate: "2023-07-25",
        referenceNumber: "10hx456i",
        partnerCode: "CITI",
        membershipId: "5675678ff",
        memberName: "Catherine Smith",
        transferAmount: 700000,
        outcomeCode: "0002",
        notificationMethod: 1,
        emailAddress: "catherinesmith@email.com",
        phoneNumber: "+8901234567",
        systemId: "system1235"
      },
      {
        _id: "129fb6ad87d672d8f30e99g9",
        transferDate: "2023-07-25",
        referenceNumber: "11iy456j",
        partnerCode: "UOB",
        membershipId: "6786789gg",
        memberName: "William Johnson",
        transferAmount: 800000,
        outcomeCode: "0001",
        notificationMethod: 2,
        emailAddress: "williamjohnson@email.com",
        phoneNumber: "+9012345678",
        systemId: "system5679"
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