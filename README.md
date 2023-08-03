# 50.003_ESC_Project

## Changing Database

To change MongoDB server, edit MONGODB_URL in .env. 

Edit index.js with the specific database name. 
```javascript
mongoose.connect(config.MONGODB_URL,  {
    dbName: 'transferconnect', // Specify the database name, edit this accordingly
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => console.log('connected')).catch((err) => console.error('error'))
```

Edit Schemas and collection name in models/transactionEnquiryModels.js
```javascript
//edit fields according to handback file 
const transaction = new Schema({
  "Reference number": String,
  "Transfer date": Date,
  "Outcome code": String,
  "Amount": Number,
})

//change 'handback' to collection name
const handback = mongoose.model('handback', transaction, 'handback'); 
```

## Localhost

To change localhost ports and links, edit PORT and TRANSFER_CONNECT_API_URL in .env.

Currently runs with link:
http://localhost:3002/transferconnect/

## Flow
### Bank-app

TransactionEnquiryAPI on bank-app side will first get reference numbers of transactions whose outcome codes are not updated yet, i.e. "Outcome updated" = false.
Stored in this form:

```javascript
{
  "_id": {
    "$oid": "649ff46f028bd0526487adc1"
  },
  "Reference number": "0001",
  "Outcome code": "0001",
  "Outcome updated": true
}
```

Then getReferenceNumbers will pass the data to makeAPICall, which will call the TransactionEnquiryAPI on the TransferConnect side and retrieves the data from the TransferConnectDB. 

The data is then passed back to updateOutcomeCodes which will update the database on Bank-App side appropriately. 

It is currently querying every 5s, you can change the duration in controllers/transactionEnquiryController.js

```javascript
setInterval(() => {
  getReferenceNumbers()
    .then(id_list => makeApiRequest(id_list))
    .then(response_data => updateOutcomeCodes(response_data))
    .catch(error => {
      // Handle any errors that occur during the promise chain
      console.error(error);
    });
}, 5 * 1000); // 5 seconds
```

### TransferConnect

Database currently stores the handback file data in this format:
```javascript
{
  "_id": {
    "$oid": "649c7a77aa20c98e3f47baec"
  },
  "Transfer date": {
    "$date": "2020-01-01T00:00:00.000Z" //Date
  },
  "Amount": 10000, //Number
  "Reference number": "0001",
  "Outcome code": "0001"
}
```

getOutcomeCode accepts a list of reference numbers.

Link e.g.:
http://localhost:3002/transferconnect/check/0000,0001

submitTransaction is only for testing purposes to check connection to database.

