import React from 'react';

const Transaction = (props) => {

  const { transaction, loyaltyProgramId } = props;

  /*
    0000 - success 
    0001 - member not found 
    0002 - member name mismatch 
    0003 - member account closed 
    0004 - member account suspended 
    0005 - member ineligible for accrual 
    0099 - unable to process, please contact 
    support for more information 
  */
    
  const outcomeCodeMappings = (outcomeCode) => {
    switch (outcomeCode) {
      case '0000':
        return 'Success'
      case '0001':
        return 'Member not found'
      case '0002':
        return 'Member name mismatch'
      case '0003':
        return 'Member account closed'
      case '0004':
        return 'Member account suspended'
      case '0005':
        return 'Member ineligible for accrual'
      case '0099':
        return 'Unable to process, please contact support for more information'
      default:
        return 'Pending'
    }
  }

  return (
    <div>
      <h4>Transaction</h4>
      <p>
        {/*TODO: Transfer Amount in bank currency or loyalty program currency? We would likely need to store BOTH into transactions*/}
        Transfer Amount: {transaction.transferAmount}
      </p>
      <p>
        Transfer Date: {transaction.transferDate}
      </p>
      <p>
        Transaction Ref. No.: {transaction.referenceNumber}
      </p>
      <p>
        Loyalty Program: {loyaltyProgramId}
      </p>
      <p>
        Confirmed: {outcomeCodeMappings(transaction.outcomeCode)}
      </p>
    </div>
  )
}

export default Transaction;