import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

const TransactionsDisplay = (props) => {
  const { userId } = props;

  const [transactions, setTransactions] = useState({});
  const [componentsArray, setComponentsArray] = useState([]);

  const getTransactions = async () => {
    try {
      const transactionEnquiryResponse = await axios.get(`http://localhost:3001/api/transactions/${userId}`);
      const transactionEnquiryData = transactionEnquiryResponse.data;
      setTransactions(transactionEnquiryData);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [userId]);

  useEffect(() => {
    // Call the renderTransactions function to create the components array
    setComponentsArray(renderTransactions());
  }, [transactions]);

  const renderTransactions = () => {
    const array = [];

    // Loop through each transaction array along with loyaltyProgramId as key, and map them to Transaction components
    Object.entries(transactions).forEach(([key, transactionArray]) => {
      const transactionsRendered = transactionArray.map((transaction) => (
        <Transaction key={transaction.systemId} transaction={transaction} loyaltyProgramId={key}/>
      ));
      array.push(...transactionsRendered);
    });

    // Return the array of Transaction components
    return array;
  };

  return <div>{Object.keys(transactions).length > 0 && componentsArray}</div>;
};

export default TransactionsDisplay;
