import PropTypes from 'prop-types';
import React, { Component } from 'react';
import axios from 'axios';
import TransactionDisplay from './TransactionDisplay';

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionsData: []
    };
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions = async () => {
    try {
      const transactionsQueryResponse = await axios.get('http://localhost:3001/api/transactionsDisplay');
      const transactionsQueryData = transactionsQueryResponse.data?.loyaltyPrograms || [];
      console.log(transactionsQueryResponse);
      console.log(transactionsQueryData);
      this.setState({ transactionsData: transactionsQueryData });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  renderTransactions() {
    const { transactionsData } = this.state;

    const componentsArray = [];

    // Add in header sentence for number of points
    componentsArray.push(
      <p key="pointsHeader">
        Transaction History:
      </p>,
    );

    /*
            logic to pass on to actual render: if getTransactions is not yet successful,
            render Loading... else pass each data to a LoyaltyProgram component
        */
    if (transactionsData === []) {
      return (<p>Loading...</p>);
    }

    transactionsData.map((transactionData) => (
      componentsArray.push(
        <Transactions
          transferAmount={transactionData.transferAmount}
          transactionOutcome = {transactionData.outcomeCode}
          //include later
          //loyaltyProgramName = 
          transactionData={transactionData}
        />,
      )
    ));

    return componentsArray;
  }

  render() {
    return (
      <div>
        <div className="transaction-page-bg" data-testid="transactions-test">
          <h2>Transactions</h2>
          {this.renderTransactions()}
        </div>

      </div>
    );
  }
}

Transactions.propTypes = {
    //whats this
  userId: PropTypes.number.isRequired,
};

export default LoyaltyPrograms;