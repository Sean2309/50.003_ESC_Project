import React from 'react';
import TransactionsDisplay from '../components/TransactionsDisplay';

function Transactions() {
  return (
    <div data-testid="marketplace-container-test">
      <h1>Transactions</h1>
      {/* temporarily put userId = 1 */}
      <TransactionsDisplay />
    </div>
  );
}

export default Transactions;