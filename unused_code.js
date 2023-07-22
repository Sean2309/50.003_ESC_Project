// Handback Controller File
// Datetime
function getDate(date) {
    const day = date.getDate(); // Get the day (1-31)
    const month = date.getMonth() + 1; // Get the month (0-11), add 1 to match the human-readable month (1-12)
    const year = date.getFullYear(); // Get the four-digit year
    const date_out = `${year}${month}${day}`;
    return date_out;
  }
  // Getting Current Date
  const currentDate = getDate(new Date()); // to change into testDate after final implementation


// testing

// Function to check the data type of a value
function getDataType(value) {
  if (Number(value).toString() === value) {
    return 'number';
  } else if (value === 'true' || value === 'false') {
    return 'boolean';
  } else if (!isNaN(Date.parse(value))) {
    return 'date';
  } else {
    return 'string';
  }
}

  // test('check on handback csv data', (done) => {
    //     const expectedDataTypes = {
    //         'Transfer date': String,
    //         'Transfer Amount': Number,
    //         'Reference number': String,
    //         'Outcome Code': String,
    //     };
    
    //     const dataTypes = {};
    
    //     fs.createReadStream(filePath)
    //         .pipe(csv())
    //         .on('headers', (headers) => {
    //         headers.forEach((header) => {
    //             dataTypes[header] = 'unknown';
    //         });
    //         })
    //         .on('data', (row) => {
    //         Object.entries(row).forEach(([key, value]) => {
    //             if (dataTypes[key] === 'unknown') {
    //             dataTypes[key] = typeof value === 'string' ? String : Number;
    //             } else if (dataTypes[key] !== 'string') {
    //             if (dataTypes[key] !== (typeof value === 'string' ? String : Number)) {
    //                 dataTypes[key] = String;
    //             }
    //             }
    //         });
    //         })
    //         .on('end', () => {
    //         console.log('Data types for each column:');
    //         console.log(dataTypes);
    
    //         Object.entries(expectedDataTypes).forEach(([column, expectedType]) => {
    //             expect(dataTypes[column]).toBe(expectedType);
    //         });
    
    //         done();
    //         });
    // }, 20000 );// increases the timeout to 10000ms = 10s


    
// const uploadFilesToMongoDB = async() => {
//   // Connecting to MongoDB
//   await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//   // Iterating through each LP
//   for (let i = 0; i < sftpLPList.length; i++) {
//     // Getting the file path
//     const filePath = path.join(__dirname, `sftp_handback_downloads/${sftpLPList[i]}_HANDBACK_${formattedDate}.csv`);
    
//     try {
//       // Extracting the data from the csv file
      
//       const [partnerCode, results] = await extractDataFromCsv(filePath);
//       console.log(`Extracting data from ${partnerCode} Handback File`);

//       // Getting the Model for this iteration
//       const Model = await mongoose.model(mongoLPList[i], handbackFileFormSchema) || mongoose.model(mongoLPList[i], accrualFileFormSchema);
      
//       // Iterating over the results
//       for (const result of results) {
//         // Before we can insert or update data, we need to map the result's keys to match our schema
//         let mappedResult = {
//           partnerCode: partnerCode, 
//           referenceNumber: result['Reference number'], 
//           outcomeCode: result['Outcome Code'],
//         };
        
//         // Search for an existing document with the same referenceNumber
//         console.log(`Updating ${partnerCode} Database in Mongo\n`);
//         let doc = await Model.findOne({ referenceNumber: mappedResult.referenceNumber });

//         if (doc) {
//           // If the document exists, update it
//           doc.set(mappedResult);
//           await doc.save();
//         } else {
//           // If the document does not exist, create it
//           await Model.create(mappedResult);
//         }
//       }

//       console.log(`Data updated for ${partnerCode} successfully\n`);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   mongoose.connection.close();
// }