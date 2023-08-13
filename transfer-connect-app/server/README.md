Certainly! I've incorporated your initial implementation into the format I provided earlier:

---

# 50.003_ESC_Project

## Prerequisites

Ensure you have the following installed on your system:
- Node.js (v14.0 or above recommended)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**:  
   ```
   git clone [Your Repository URL]
   ```

2. **Navigate to the directory**:  
   ```
   cd [Directory Name]
   ```

3. **Install dependencies**:  
   ```
   npm install
   ```

## Configuration

### Changing Database

To change MongoDB server, edit `MONGODB_URL` in `.env`.

Edit `index.js` with the specific database name:

```javascript
mongoose.connect(config.MONGODB_URL,  {
    dbName: 'transferconnect', // Specify the database name, edit this accordingly
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res) => console.log('connected')).catch((err) => console.error('error'));
```

Modify schemas and collection names in `models/transactionEnquiryModels.js`:

```javascript
// Edit fields according to handback file 
const transaction = new Schema({
  "Reference number": String,
  "Transfer date": Date,
  "Outcome code": String,
  "Amount": Number,
});

// Change 'handback' to collection name
const handback = mongoose.model('handback', transaction, 'handback'); 
```

### Localhost

To change localhost ports and links, edit `PORT` and `TRANSFER_CONNECT_API_URL` in `.env`.

Currently, the application runs with the link:  
http://localhost:3002/transferconnect/

## Flow

### Bank-app

The `TransactionEnquiryAPI` on the bank-app side will first fetch reference numbers of transactions where the outcome codes aren't updated, i.e., "Outcome updated" = false.

Data is stored as:

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

The function `getReferenceNumbers` will pass the data to `makeAPICall`, which invokes the `TransactionEnquiryAPI` on the TransferConnect side and retrieves data from the TransferConnectDB.

The data is then relayed back to `updateOutcomeCodes`, which updates the database on the Bank-App side.

Queries currently happen every 5 seconds. Adjust this duration in `controllers/transactionEnquiryController.js`:

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

The database presently stores the handback file data as:

```javascript
{
  "_id": {
    "$oid": "649c7a77aa20c98e3f47baec"
  },
  "Transfer date": {
    "$date": "2020-01-01T00:00:00.000Z" // Date
  },
  "Amount": 10000, // Number
  "Reference number": "0001",
  "Outcome code": "0001"
}
```

The function `getOutcomeCode` accepts a list of reference numbers.

Example link:  
http://localhost:3002/transferconnect/check/0000,0001

The function `submitTransaction` is solely for testing to verify the database connection.

## Troubleshooting

1. **MongoDB Connection Issues**:  
   Confirm the `MONGODB_URL` is correct and that the MongoDB instance is running.

2. **Port Conflicts**:  
   Make sure no other application runs on the configured port. If necessary, modify the port in the `.env` file.

## Contributing

If you wish others to contribute to your project, provide guidelines here.

## License

Your chosen license (if any), e.g., MIT, GPL, etc.

---