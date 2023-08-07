# Bank App

### Login 
```mermaid
classDiagram

LoginView <-- AuthManagerController
AuthManagerController --> UserCredentialsModel 
AuthManagerController --> UserProfileModel 

class LoginView{
    submitDetails(): void
}

class UserCredentialsModel{
  loginId: String,
  password: String,
  userId: String
}

class UserProfileModel{
    firstName: String,
    lastName: String,
    abcPoints: Number,
    emailAddress: String,
    phoneNumber: String,
    notificationMethod: String,
    userId: String
}

class AuthManagerController{
    userProfiles: List<<User>UserProfileModel>
    userCredentials: List<<User>UserCredential>
    authenticateUserDetails(): boolean
    authorizeUser(): response
}

```
### Query Loyalty Program Details (Loyalty Points Marketplace)

```mermaid
classDiagram

LoyaltyProgramsModel "1..*" <-- "1" LoyaltyProgramsController
MarketplaceView "1" <-- "1" LoyaltyProgramsController


class LoyaltyProgramsModel {
    programID:String 
    programName:String
    currencyName:String
    processingTime:String
    description:String
    enrollmentLink:String
    tncLink:String
    membershipFormat:String
}


class LoyaltyProgramsController {
  loyaltyProgramsModel: LoyaltyProgramsModel
  getLoyaltyPrograms(): void
  updateDb(): void
}

class MarketplaceView {
  renderMarketplace():void
  popupTransferFormView(): TransferFormView
}

```



### Submit Credit Transfer Request
```mermaid
classDiagram

LoyaltyProgramsModel "1..*" <-- "1" TransferFormController
TransferFormModel "1..*" <-- "1" TransferFormController
TransferFormView "1" <-- "1" TransferFormController
UserProfileModel "1" <-- "1" TransferFormController

class LoyaltyProgramsModel {
    programID:String 
    programName:String
    currencyName:String
    processingTime:String
    description:String
    enrollmentLink:String
    tncLink:String
    membershipFormat:String
}

class TransferFormModel {
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
}

class UserProfileModel{
    firstName: String,
    lastName: String,
    abcPoints: Number,
    emailAddress: String,
    phoneNumber: String,
    notificationMethod: String,
    userId: String
}

class TransferFormController {
  abcPoints: int
  userId: int
  transferFormData: transferFormModel
  transferConnectApiUrl: String

  parseFormDetails(): void  
  postTransaction(): void
  submitTransferForm(): void
  membershipIdValidation(): boolean
}

class TransferFormView {
  renderForm(): void
  submitTransferForm(): void
}


```

### Enquire Transaction Status

```mermaid
classDiagram
class TransactionEnquiryController 
TransactionEnquiryController "1" --> "*" TransactionModel


class TransactionEnquiryController{
    transactionSchema: TransactionEnquiryModel
    startEnquiry()
    getReferenceNumbers()
    makeApiRequest()
    updateOutcomeCodes()
}

class TransactionModel{
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
}
```
### Receive Webhook Post

```mermaid
classDiagram
class WebhookController 
WebhookController "1" --> "*" TransactionModel


class WebhookController{
    transactionSchema: TransactionEnquiryModel
    processData()
    processResponse()
    updateDBandNotifs()
    updateOutcomeCodes()
    sendPushNotification()
}

class TransactionModel{
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
}
```

# TransferConnect

### Loyalty Program Query
```mermaid

classDiagram
QueryModel "1" <-- "1" LoyaltyProgramModel
QueryController"1" <-- "1"  QueryModel
QueryModel "1" <-- "1"  CurrencyRatesModel

class QueryModel{
    -loyaltyProgList: List<<LP>LoyaltyProgramModel>
    -CurrencyRatesList: List <<LP>CurrencyRatesModel>
}

class LoyaltyProgramModel{
    -ProgramId: String
    -ProgramName: String
    -currencyName: String
    -ProcessingTime: String
    -description: String 
    -enrollmentLink: String
}
 

class CurrencyRatesModel{
    -ProgramId: String
  -currencyRates: Number
}

class QueryController{
    -queryFromDb: void()   
    -handleRes: void()
}

```

### Enquire Transaction Status

```mermaid
classDiagram
class TransactionEnquiryController
TransactionEnquiryController "1" --> "*" TransactionModel


class TransactionEnquiryController{
    transactionSchema: TransactionModel
    processRoute()
    getOutcomeCode()
}

class TransactionModel{
    userNumber: String
    membershipId: String,
    membershipName: String,
    transferDate: String,
    transferAmount: Number,
    referenceNumber: String,
    partnerCode: String,
    outcomeCode: String
}


```

### Post Webhook 
```mermaid
classDiagram
class WebhookController 
WebhookController "1" --> "*" TransactionModel


class WebhookController{
    transactionSchema: TransactionEnquiryModel
    processData()
    processResponse()
    updateDBandNotifs()
    updateOutcomeCodes()
    sendPushNotification()
}

class TransactionModel{
  membershipId: String,
  membershipName: String,
  transferDate: String,
  transferAmount: Number,
  referenceNumber: String,
  partnerCode: String,
  notificationMethod: String,
  emailAddress: String,
  phoneNumber: String
}
```


### Notify Transaction Status

```mermaid
classDiagram
class NotifController
<<abstract>> NotifController
NotifController"1" --> "*"MessageNotif: Inheritance
NotifController"1" --> "*"EmailNotif: Inheritance
NotifController"1" --> "*"InAppNotif: Inheritance


class NotifController{
    -notif_mode: String
    -TransactionDetails: String
    -getTransactionDetails(): String
    -getUserNotifMode(): String
    -sendNotif(): void
}

class MessageNotif{
    - UserNumber: String
    - sendNotif(): void
}

class EmailNotif{
    -UserEmail: String
    -sendNotif(): void
}

class InAppNotif{
    -sendNotif(): void
    -updateStatus(): void
}


```
### Send Transfer Fulfilment Accrual Files 

```mermaid
classDiagram
    AccrualController "1" --> "*" TransactionModel
    index "1" --> "1" AccrualController
    clearFolder "1" --> "1" AccrualController

    class index {
    queryFromDBandUpload(): void
    }

    class clearFolder {
        clearFolder(String folderPath): void
    }

    class AccrualController{
        getModel(): mongoose.model
        getDataFromCollection(): mongoose.model
        groupData(mongoose.model data): mongoose.model
        getPartnerCodes(): List partnerCode
        writeGroupedDataToCsv(mongoose.model groups, mongoose.model collection): void
        clearAccrualFiles(): void
        writeCollectionsToCsv(): void
        uploadFilesToServer(): void
        queryFromDBandUpload(): void
    }


  class TransactionModel{
        membershipId: String,
        memberName: String,
        transferDate: String,
        transferAmount: Number,
        referenceNumber: String,
        partnerCode: String,
        outcomeCode: String,
        notificationMethod: Number,
        emailAddress: String,
        phoneNumber: String,
        systemId: String
    }
    
```
### Receive Transfer Fulfilment Handback File 
```mermaid
classDiagram
HandbackController "1" --> "*" TransactionModel
index "1"--> "1" HandbackController
date "1" --> "1" HandbackController
clearFolder "1" --> "1" HandbackController

class date {
    getFormattedDate(String format): Date
}

class clearFolder {
    clearFolder(String folderPath): void
}

class index {
    downloadfromSFTPandUpload(): void
}

class HandbackController{
    -confirmedTransactions: List<<list>TransactionModel>
    -getModelForLP(String loyaltyProgram): mongoose.model[loyaltyProgram]
    -clearFolders(): void
    -retrieveFromServer(Date targetDate): void
    -extractDataFromCsv(String filePath): String partnerCode, object results
    -uploadFilesToMongoDB(Date targetDate): void
    -downloadfromSFTPandUpload(List partnerCodeList): void
    -testHandbackFileFns(List partnerCodeList): void
}

class TransactionModel{
        membershipId: String,
        memberName: String,
        transferDate: String,
        transferAmount: Number,
        referenceNumber: String,
        partnerCode: String,
        outcomeCode: String,
        notificationMethod: Number,
        emailAddress: String,
        phoneNumber: String,
        systemId: String
    }

```

# Sequence Diagrams
### Transaction submission flow between BA client,BA server, BA database, TC server and TC database.
BA- Bank app.
TC - Transfer connect app

```mermaid
sequenceDiagram

participant Client as Client
participant BankClientApp as "Bank Client App"
participant BankServerApp as "Bank Server App"
participant TCApp as "TC App"
participant MongoDBTC as "MongoDB (TC)"
participant MongoDBBank as "MongoDB (Bank App)"

Client->>BankClientApp: Submit TransactionData
activate BankClientApp

BankClientApp ->> BankClientApp: ValidateTransactionData()
alt TransactionData Validation Success
    deactivate BankClientApp

    BankClientApp -->> BankServerApp: postRequest(TransactionData)
    activate BankServerApp

    BankServerApp ->> BankServerApp: Validate(TransactionData)
    deactivate BankServerApp

    alt TransactionData Validation Success - BA server
        BankServerApp ->> TCApp: postRequest(TransactionData, partnerCode)
        activate TCApp
        TCApp ->> TCApp: Validate(TransactionData, partnerCode)
        deactivate TCApp

        alt TransactionData Validation Success - TC server
            TCApp ->> MongoDBTC: Save TransactionData
            TCApp -->> BankServerApp: Success response 
            
            BankServerApp ->> MongoDBBank: Save transactionData
           
            MongoDBBank -->> BankServerApp: Success response
        else TransactionData Validation Failure - TC server
            TCApp -->> BankServerApp: Error Response
        end

       
    else TransactionData Validation Failure - BA server
        BankServerApp -->> BankClientApp: Error response
    end
else TransactionData Validation Failure
    BankClientApp -->> Client: Respond with error
end

```
### Daily interactions between TransferConnect App and Bank App to supply information about Loyalty Programs
```mermaid
sequenceDiagram

BankApp->>+TransferConnectApp: HTTP Request 

TransferConnectApp->>+TransferConnectDatabase: mongoose.connect()

TransferConnectDatabase->>-TransferConnectApp: response

TransferConnectApp->>-BankApp: 
alt Data obtained successfully
    TransferConnectApp->>BankApp:pushLoyaltyProgramData()
else Failed to obtain data
  TransferConnectApp->>BankApp:pushError404()
end

```

### Interactions between Bank App and TransferConnect App to support Bank App transaction enquiries

```mermaid

sequenceDiagram
    activate BankApp
    BankApp ->> BankApp: getReferenceNumbers()
    BankApp -->> TransferConnectApp: makeApiRequest()
    deactivate BankApp
    activate TransferConnectApp
    TransferConnectApp ->> TransferConnectApp: processRoute()
    deactivate TransferConnectApp
    activate TransferConnectApp
    TransferConnectApp ->> TransferConnectApp: getOutcomeCode()
    TransferConnectApp -->> BankApp: return
    deactivate TransferConnectApp
    activate BankApp
    BankApp ->> BankApp: updateOutcomeCodes()
    deactivate BankApp

    TransferConnectApp->>BankApp: 
    alt OutcomeCode updated
    TransferConnectApp->>BankApp: webhookPost()
    end
    
```

   



### Interactions between TransactionEnquiry API provided by TransferConnect App and Notif Controller in Bank App to support notifications to Bank App/Bank App User


```mermaid
sequenceDiagram
    TransactionEnquiryAPI -->> NotifController: TransactionStatus_Updated == True
    activate NotifController
    NotifController ->> NotifController:getTransactionDetails()
    deactivate NotifController
    
    activate NotifController
    NotifController ->> NotifController:getUserNotifMode()
    NotifController ->> User: sendNotif()
    deactivate NotifController

```

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
        TransferConnectApp ->> BankApp: webhookPost()
    end
```

