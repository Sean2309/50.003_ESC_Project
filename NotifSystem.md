```mermaid
classDiagram
class NotifController
<<abstract>> NotifController
NotifController"1" --> "*"messageNotification
NotifController"1" --> "*"emailNotification
NotifController"1" --> "*"InAppNotif


class NotifController{
    - notificationMethod: Integer
    - getUserNotifMode(): void
}

class messageNotification{
    - messageFormat: String
    - phoneNumber: String
    - sendMessages(phoneNumber)
}

class emailNotification{
    - emailFormat: String
    - emailAddress: String
    - sendEmail(emailAddress)
}

class InAppNotif{
    - membershipId: String
    - showNotification()
}
```
```Mermaid

sequenceDiagram
    activate TransactionEnquiryAPI
    TransactionEnquiryAPI -) TransactionEnquiryAPI:getTransactionDetails()
    deactivate TransactionEnquiryAPI
    TransactionEnquiryAPI -->> NotifController: TransactionStatus_Updated == True
    
    activate NotifController
    NotifController -) NotifController:getUserNotifMode()
    NotifController -) User: sendNotification()
    deactivate NotifController

```
