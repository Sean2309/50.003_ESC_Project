import React from 'react';
import LoyaltyPrograms from '../components/LoyaltyPrograms';

function Marketplace() {
  return (
    <div data-testid="marketplace-container-test">
      <h1>Marketplace</h1>
      {/* temporarily put userId = 1 */}
      <LoyaltyPrograms />
    </div>
  );
}

export default Marketplace;
