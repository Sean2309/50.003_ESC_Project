import React from 'react';

const Transaction = (props) => {

    const { transaction } = props;

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
    </div>
  )
}

export default Transaction;