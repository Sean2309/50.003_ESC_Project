import React from 'react';
import Transactions from '../components/TransactionDisplay';

function Transactions() {
  return (
    <div data-testid="marketplace-container-test">
      <h1>Marketplace</h1>
      {/* temporarily put userId = 1 */}
      <Transactions userId={1} />
    </div>
  );
}

export default Transactions;