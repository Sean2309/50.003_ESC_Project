erDiagram
    user ||..|{ transferForm : SUBMITS
    userProfile {
        object UserID
        int abcPoints
        string notificationMethod
        string emailAddress
        string phoneNumber

    }
    transferForm {
        string userID
        string memberName
        string membershipId
        string transferDate
        string transferAmount
        string referenceNumber
        string partnerCode
        string notificationMethod
        string phoneNumber
        string systemId
        string emailAddress
        string outcomeCode
    }
    
    userCredentials{
        string loginId
        string userID
        string password
    }
    loyaltyProgram{
        string programId
        string programName
        string currenyName
        string processingTime
        string description
        string enrollmentLink
        string tncLink
        string membershipFormat
        int currencyRate
    }
   
   user ||--|| userCredentials: contains
   user ||--|| userProfile: contains
   user ||--o{ loyaltyProgram: view

   bankappDatabase ||--o{ loyaltyProgram: stores
   bankappDatabase ||--o{ userCredentials: stores
    bankappDatabase ||--o{ transferForm: stores
    bankappDatabase ||--o{ userProfile: stores

tcDatabase ||--o{ tctransferForm: stores
tcDatabase ||--o{ currencyRate: stores
tcDatabase ||--o{ loyaltyProgramProviders: stores
    tctransferForm {
        string memberName
        string membershipId
        string transferDate
        string transferAmount
        string referenceNumber
        string partnerCode
        string notificationMethod
        string phoneNumber
        string systemId
        string emailAddress
        string outcomeCode
    }

loyaltyProgramProviders {
        string programId
        string programName
        string currenyName
        string processingTime
        string description
        string enrollmentLink
        string tncLink
        string membershipFormat
        
}
currencyRate{
    string programId
    float currenyRate
}

loyaltyProgram }o -- o{ loyaltyProgramProviders: gets