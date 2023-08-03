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

# TransferConnect

### Loyalty Program Query
```mermaid

classDiagram

LoyaltyProgramQueryModel "1"  <-- "1" LoyaltyProgramQueryController
CurrencyRateModel "1"  <-- "1" LoyaltyProgramQueryController


class LoyaltyProgramQueryController {
   
    database: TransConnectDb
    loyaltyProgramsdata:LoyaltyProgramModel
    currencyRateData:currencyRateModel
  getLoyaltyPrograms(): void  
}

class LoyaltyProgramQueryModel {
  programID: String
  programName: String
  currencyName: String
  processingTime: String
  description: String
  enrollmentLink: String
  tncLink: String
  membershipFormat: String
}

class CurrencyRateModel {
  currencyRate: String,
  programID: String,
  appName: String
}
```
# Transaction Enquiry API

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

    class AccrualController{
        loyaltyPrograms: List<<list>String>
        writeCollectionsToCsv(): void
        uploadFilesToServer(): void
        queryFromDBandUpload(): void
    }

    class TransactionModel{
        membershipId: String,
        membershipName: String,
        transferDate: String,
        transferAmount: Number,
        referenceNumber: String,
        partnerCode: String,
        outcomeCode: String,
    }
```
### Receive Transfer Fulfilment Handback File 
```mermaid
classDiagram
HandbackController "1" --> "*" TransactionModel 

class HandbackController{
    confirmedTransactions: List<<list>TransactionModel>
    retrieveFromServer(): void
    extractDataFromCsv(String filePath): void
    uploadFilesToMongoDB(): void
}

class TransactionModel{
    membershipId: String,
    membershipName: String,
    transferDate: String,
    transferAmount: Number,
    referenceNumber: String,
    partnerCode: String,
    outcomeCode: String,
}
```

# Sequence Diagrams
### Daily interactions between TransferConnect App and Bank App to supply information about Loyalty Programs

```mermaid
sequenceDiagram

BankApp->>+TransferConnectApp: HTTP Request 

TransferConnectApp->>+TransferConnectDatabase: mongoose.connect()

TransferConnectDatabase->>-TransferConnectApp: response

TransferConnectApp->>-BankApp: 
alt Data obtained successfully
    TransferConnectApp->>BankApp:pushLoyaltyProgramProviders()
else Failed to obtain data
  TransferConnectApp->>BankApp:pushError404()
end
```
### Daily interactions between TransferConnect App, Bank App and different Loyalty Programs to fulfil transactions
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
    TransferConnectApp ->> TransferConnectApp: transactionEnquiryAPI()
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