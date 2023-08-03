![alt](./src/mvcdiagram.jpg)

User can:


    View login page
    fill up loginform
    Login with userid n password
    go to rewardscenter view
    view their own points

    go to pointsTransferView 
    - they can look at x number of loyalty programs
    - currency exchange rate
    
    do a credit transfer form
    - fill up credit transfer form
    - enter their lp membership 
    
    submit credit transfer form

    Receive updates (notifs)
    
    
    
# Bank App

### Login 
```mermaid
classDiagram

LoginView -- AuthManagerController
AuthManagerController -- UserModel

class LoginView{
    +submitDetails(): void
}

class UserModel{
    -username: String
    -userFirstName: String
    -userLastName: String
    -userId: String
    -password: String
    -email: String
    -userPoints: int
}

class AuthManagerController{
    -userList: List<<User>UserModel>
    -authenticateUserDetails(): boolean
}
```


### RewardsCenter
```mermaid
classDiagram
RewardsCentreView -- RewardsCentreController

class RewardsCentreView{
    +displayCurrentPoints():void
}


class RewardsCentreController{
    +userPoints: int
    +redirect()
}
```

### PointsTransfer
```mermaid
classDiagram
PointsTransferView -- LoyaltyProgramModel
LoyaltyProgramModel -- PointsTransferController
class PointsTransferView{
    +displayLoyaltyPrograms():void
    +displayCurrentPoints():void
}

class LoyaltyProgramModel{
    -loyaltyProgramId: String
    -loyaltyProgramName: String
    -loyaltyProgramRates: double
    -loyaltyProgramDescription: String
    -loyaltyProgramImg: url
}

class PointsTransferController{
    -loyaltyProgList: List<<LP>LoyaltyProgramModel>
    +queryLoyaltyProgramAPI(): void
    +redirect(): void
}
```



### CreditTransferForm
```mermaid
classDiagram
TransferFormView -- TransferFormModel
TransferFormModel -- TransferFormController


class TransferFormView{
    +submitForm():void
}

class TransferFormModel{
    -primaryCardholder: String
    -membershipId: String
}

class TransferFormController{
    -userPoints: int
    -userId: int
    -transferDetails: TransferFormModel
    -parseFormDetails(): void
}
```


### Notification System
```mermaid
classDiagram
class NotifController{
    -sendNotif(): void
}
```

# TransferConnect

### Loyalty Program Query
```mermaid
classDiagram
QueryModel <-- LoyaltyProgramModel
QueryController -- QueryModel

class QueryModel{
    -loyaltyProgList: List<<LP>LoyaltyProgramModel>
}

class LoyaltyProgramModel{
    -loyaltyProgramId: String
    -loyaltyProgramName: String
    -loyaltyProgramRates: double
    -loyaltyProgramDescription: String
    -loyaltyProgramImg: url
}

class QueryController{
    -queryFromDb: void()   
    -handleRes: void()
}
```
# Transaction Enquiry API

```mermaid
classDiagram
class transactionEnquiryController_TC
transactionEnquiryController_TC "1" --> "*" transactionEnquiryModel


class transactionEnquiryController_TC{
    - transactionSchema: transactionEnquiryModel
    - processRoute()
    - getOutcomeCode()
}

class transactionEnquiryModel{
    - UserNumber: String
    - membershipId: String,
    - membershipName: String,
    - transferDate: String,
    - transferAmount: Number,
    - referenceNumber: String,
    - partnerCode: String,
    - outcomeCode: String
}
```
```mermaid
classDiagram
class transactionEnquiryController_BA
transactionEnquiryController_BA "1" --> "*" transactionEnquiryModel


class transactionEnquiryController_BA{
    - transactionSchema: transactionEnquiryModel
    - startEnquiry()
    - getReferenceNumbers()
    - makeApiRequest()
    - updateOutcomeCodes()
}

class transactionEnquiryModel{
    - UserNumber: String
    - membershipId: String,
    - membershipName: String,
    - transferDate: String,
    - transferAmount: Number,
    - referenceNumber: String,
    - partnerCode: String,
    - outcomeCode: String
}
```
# TransferFile SENDING API

```mermaid
classDiagram
    index "1"--> "1" AccrualController
    AccrualController "1" --> "*" TransactionModel

    class index{
        queryFromDBandUpload: void
    }

    class AccrualController{
        -collections: List<<list>String>
        -writeCollectionsToCsv(): void
        -uploadFilesToServer(): void
        -queryFromDBandUpload(): void
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
# TransferFile RETRIEVING API


```mermaid
classDiagram
HandbackController "1" --> "*" ConfirmationModel
index "1"--> "1" HandbackController
date "1" --> "1" HandbackController

class date {
    getFormattedDate(String format): Date
}

class index {
    downloadfromSFTPandUpload(): voidgit 
}

class HandbackController{
    -confirmedTransactions: List<<list>ConfirmationModel>
    -convertDateFormat(String date): String date
    -getModelForLP(String loyaltyProgram): mongoose.model[loyaltyProgram]
    -retrieveFromServer(Date targetDate): void
    -extractDataFromCsv(String filePath): String partnerCode, object results
    -uploadFilesToMongoDB(Date targetDate): void
}

class ConfirmationModel{
    -transferDate: String
    -transferAmount: Number
    -referenceNumber: String
    -outcomeCode: String
}
```
