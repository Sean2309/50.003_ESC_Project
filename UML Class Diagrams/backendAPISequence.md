# Backend API
```mermaid
sequenceDiagram

    %% Initialising Actors
    participant BankApp
    participant TransferConnectApp
    participant LoyaltyProgram

    %% Connections

    %% Transaction Enquiry API
    loop Every hour
        BankApp ->> TransferConnectApp: transactionEnquiryAPI()
    activate TransferConnectApp
    TransferConnectApp -) TransferConnectApp: transactionEnquiryAPI()
    deactivate TransferConnectApp
    TransferConnectApp -->> BankApp: transactionEnquiryAPI()
    end
    
    %% TransferFile Sending API
    loop Every day 
        activate TransferConnectApp
        TransferConnectApp ->> TransferConnectApp: downloadFilesFromMongoDB()
        deactivate TransferConnectApp
        TransferConnectApp ->> LoyaltyProgram: sendToServer()
    end

    %% TransferFile Retrieving API
    loop Every day
        TransferConnectApp ->> LoyaltyProgram: retrieveFromServer()
        activate TransferConnectApp
        TransferConnectApp ->> TransferConnectApp: uploadFilesToMongoDB()
        deactivate TransferConnectApp
    end
```