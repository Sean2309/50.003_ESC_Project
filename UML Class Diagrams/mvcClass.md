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

# TransferFile SENDING API

```mermaid
classDiagram

AccrualController -- TransactionModel

class AccrualController{
    -transactionsList: List<<list>TransactionModel>
    -retrieveFromDb(): void
    -consolidateInfo(): void
    -sendToServer():void
}

class TransactionModel{
    -loyaltyProgramId: String
    -userId: String
    -userFirstName: String
    -userLastName: String
    -transferDate: Date
    -amount: int
    -referenceNo: String
    -partnerCode: String
}
```
# TransferFile RETRIEVING API

transferconnect receive handback > update outcomecode to each transaction stored in db


```mermaid
classDiagram
HandbackController -- ConfirmationModel

class HandbackController{
    -confirmedTransactions: List<<list>ConfirmationModel>

    -retrieveFromServer(): void
    -consolidateInfo(): void
    -responseToGET(): List<<cm>ConfirmationModel> >> JSON
}

class ConfirmationModel{
    -transferDate: Date
    -amount: int
    -referenceNo: String
    -outcomeCode: String
}
```
