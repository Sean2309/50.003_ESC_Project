import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

const TransactionsDisplay = (props) => {
  const { userId } = props;

  const [transactions, setTransactions] = useState({});
  const [componentsArray, setComponentsArray] = useState([]);
  const [uniqueTransactionRefs, setUniqueTransactionRefs] = useState(new Set());

  const fetchTransactions = async () => {
    try {
      const transactionEnquiryResponse = await axios.get(`http://localhost:3001/api/transactions/${userId}`);
      const transactionEnquiryData = transactionEnquiryResponse.data;
      setTransactions(transactionEnquiryData);
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  };

  useEffect(() => {
    // Fetch transactions when the component is mounted
    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    // Call the renderTransactions function to create the components array
    const array = [];

    // Loop through each transaction array along with loyaltyProgramId as key, and map them to Transaction components
    Object.entries(transactions).forEach(([key, transactionArray]) => {
      const transactionsRendered = transactionArray.map((transaction) => {
        if (!uniqueTransactionRefs.has(transaction.referenceNumber)) {
          // Push the transaction ID to the set to prevent duplicates
          setUniqueTransactionRefs((prevSet) => new Set(prevSet).add(transaction.referenceNumber));

          return (
            <Transaction key={transaction.systemId} transaction={transaction} loyaltyProgramId={key} />
          );
        }
        return null; // Skip duplicate transactions
      });
      array.push(...transactionsRendered);
    });

    // Update the components array
    setComponentsArray(array);
  }, [transactions, uniqueTransactionRefs]);

  return <div>{Object.keys(transactions).length > 0 && componentsArray}</div>;
};

export default TransactionsDisplay;
