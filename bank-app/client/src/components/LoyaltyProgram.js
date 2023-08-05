import PropTypes from 'prop-types';
import React from 'react';
import TransferForm from './TransferForm';
import '../css/loyalty-styles.css';

function LoyaltyProgram(props) {
  const { loyaltyProgramData, userProfile, updateUserProfile } = props;

  return (
    <div className="loyalty-box" data-testid="loyaltyprograms-test">
      <h3>{loyaltyProgramData.programName}</h3>
      <p>
        Description:
        {loyaltyProgramData.description}
      </p>
      <p>
        Processing Time:
        {loyaltyProgramData.processingTime}
      </p>
      {/* Display exchange rate */}
      <p>
        1000 ABC Points =
        {loyaltyProgramData.currencyRate * 1000}
        {' '}
        {loyaltyProgramData.currencyName}
      </p>
      <p>
        <a href={loyaltyProgramData.enrollmentLink}>Enrollment Link</a>
      </p>
      <p>
        <a href={loyaltyProgramData.tncLink}>Terms and Conditions</a>
      </p>
      {/* pass currencyRate, membershipFormat, userProfile to TransferForm */}
      <TransferForm
        membershipFormat={loyaltyProgramData.membershipFormat}
        currencyRate={loyaltyProgramData.currencyRate}
        userProfile={userProfile}
        loyaltyProgramId={loyaltyProgramData.programId}
        updateUserProfile={updateUserProfile}
      />
    </div>
  );
}

LoyaltyProgram.propTypes = {
  loyaltyProgramData: PropTypes.shape({
    programName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    processingTime: PropTypes.string.isRequired,
    currencyRate: PropTypes.number.isRequired,
    currencyName: PropTypes.string.isRequired,
    enrollmentLink: PropTypes.string.isRequired,
    tncLink: PropTypes.string.isRequired,
    programId: PropTypes.string.isRequired,
    membershipFormat: PropTypes.string.isRequired,
  }).isRequired,
  userProfile: PropTypes.shape({}).isRequired,
};

export default LoyaltyProgram;
