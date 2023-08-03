import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

const TransactionsDisplay = (props) => {
  // Destructure the userId from the props
  const { userId } = props;

  const [transactions, setTransactions] = useState({});
  const [componentsArray, setComponentsArray] = useState([]);

  // Function to fetch transactions from the API
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
    // Call the getTransactions function to fetch data
    getTransactions();
  }, [userId]);

  useEffect(() => {
    // Call the renderTransactions function to create the components array
    setComponentsArray(renderTransactions());
    // We want to update the rendered components whenever transactions change,
    // so we include 'transactions' in the dependency array of useEffect
  }, [transactions]);

  // Function to render the transactions into components
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

  // Conditional rendering to avoid rendering empty components when transactions are not available
  return <div>{Object.keys(transactions).length > 0 && componentsArray}</div>;
};

export default TransactionsDisplay;
