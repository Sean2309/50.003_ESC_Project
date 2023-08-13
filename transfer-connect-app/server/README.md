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

### Accrual File Controller (`accrualFileController.js`)

This module controls the process of querying data from the MongoDB, writing it to CSV files, and subsequently uploading the CSV files to a server. The primary objective of this controller is to manage the accrual files.

#### Dependencies

The module requires several dependencies including but not limited to:
- `mongoose` for MongoDB interaction.
- `csv-writer` to write data to CSV files.
- `files.com` library for managing file operations.
- `cron` to schedule tasks at specified intervals.
- Utility functions from other parts of the project such as `dateUtil` and `clearFolder`.

#### Class: `AccrualFileController`

The primary class defined in this module is the `AccrualFileController`.

##### Methods

- **`startService()`**: Schedules the `queryFromDBandUpload` method to run at a specific interval using Cron. The current configuration is set to '* * 0 * * *' which represents running the task every day at midnight.

- **`getModel(collection)`**: Retrieves the Mongoose model based on a given collection name.

- **`getDataFromCollection(Model, stringToday)`**: Fetches data from a MongoDB collection where the outcomeCode does not exist and the transfer date matches the provided date.

- **`groupData(data)`**: Organizes the fetched data by the partnerCode attribute, returning a structured data grouping.

- **`getPartnerCodes()`**: Iterates over each MongoDB collection, fetches, and groups data, and then aggregates and returns unique partner codes.

- **`writeGroupedDataToCsv(groups, collection)`**: Writes the grouped data into separate CSV files based on each partner code.

- **`writeCollectionsToCsv()`**: Iterates over collections and writes data to CSV files.

- **`uploadFilesToServer()`**: Uploads generated CSV files to a server.

- **`queryFromDBandUpload()`**: The main orchestrating function. It clears the accrual files folder, writes data to CSV files, uploads these files to a server, gets the partner codes, and logs when the process is complete.

#### Implementation Notes

- The accrual files are stored in a dedicated directory named 'accrual_files'. The directory is checked and created if it doesn't already exist during the module initialization.

- For uploading files to the server, `files.com` library is utilized. Make sure the server's base URL and API key are correctly configured in your environment or config file.

---

## Handback File Controller (`handbackFileController.js)

`handbackFileController.js` handles the processing of handback files. The main functionalities include:

1. Downloading the files from an SFTP server.
2. Parsing them.
3. Uploading the data to MongoDB.

### Modules and Dependencies:

- `mongoose`: Used for defining, querying, and updating the MongoDB data.
- `fs`: Provides the tools for reading and writing to the filesystem.
- `csv-parser`: Parses csv data.
- `files.com`: Provides tools and utilities for working with files.com service.
- `path`: Used for joining and resolving directory paths.
- `cron`: For setting up scheduled tasks.
- `webhookController`: (assumed) handles the sending of webhooks.
- `accrualFileController`: (assumed) a similar controller for dealing with accrual files.
- `.env`: Contains configuration and secret values for the application.

### Helper Functions:

- `getFormattedDate`: Get the formatted date.
- `clearFolder`: Utility to clear the contents of a folder.
- `convertDateFormat`: Utility to convert date format.

### `HandbackFileController` class:

Manages operations related to handback files. The key methods include:
   
- `startService`: Starts a CronJob.
- `downloadfromSFTPandUpload`: Downloads the files and then uploads the parsed data to MongoDB.
- `testHandbackFileFns`: A test method with a fixed date.
- `getModelForLP`: Compares the existing model with the new one and updates if necessary.
- `clearFolders`: Clears the directory.
- `retrieveFromServer`: Downloads the handback files from SFTP.
- `extractDataFromCsv`: Reads, parses, and returns the data in JSON format.
- `uploadFilesToMongoDB`: Takes the extracted data and uploads it to MongoDB.

### Main Function (`index.js`)

This is the main entry point for the server. 

#### Dependencies

It requires multiple modules and libraries, including express, mongoose, cors, various routers, controllers, and utility functions.

#### Initialization & Setup

1. A connection to MongoDB is established using the provided configuration from `config.js`.

2. The `transferConnectSimulation` function orchestrates several key operations: It first queries the database and uploads the accrual file, then runs the accrual to handback operation, and finally downloads from SFTP and uploads to the database. This function is executed at the start.

3. Middleware setups include allowing CORS (using `cors()`) and parsing incoming JSON requests (using `express.json()`).

4. Different routes have been set up for various functionalities: 
   - `/api/transactions` to handle transaction operations.
   - `/api/loyaltyprograms` to retrieve loyalty program information.
   - `/api/transactionenquiry` for transaction enquiry operations.
   - `/api/webhook` for webhook testing.

5. Finally, the express app is set to listen on the specified port from the config.