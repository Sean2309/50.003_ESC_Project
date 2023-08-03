import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

const TransactionsDisplay = (props) => {
  const { userId } = props;
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    try {
      const transactionEnquiryResponse = await axios.get(`http://localhost:3001/api/transactions/${userId}`);
      const transactionEnquiryData = transactionEnquiryResponse.data;
      setTransactions(transactionEnquiryData);
    }
    catch (error) {
      console.error('Error fetching transactions', error);
    }
    return;
  }

  useEffect(() => {
    getTransactions();
  }, []);

  const renderTransactions = () => {
    const componentsArray = [];

    if (transactions === []) {
      return (<p>Loading...</p>);
    }

    transactions.forEach((transactionArray) => {

      transactionArray.map((transaction) => (
        componentsArray.push(
          <Transaction
            key={transaction.systemId}
            transaction={transaction}
          />
        )
      ));

    })

    return componentsArray;

  }

  return (
    <div>
      {renderTransactions()}
    </div>
  )
}

export default TransactionsDisplay;