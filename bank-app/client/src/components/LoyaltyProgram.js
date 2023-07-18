import React, { Component } from 'react';
import TransferForm from './TransferForm';
import '../css/loyalty-styles.css';

class LoyaltyProgram extends Component {

    render() {
        const { loyaltyProgramData, userProfile } = this.props;

        return (
            <div className='loyalty-box'>
                <h3>{loyaltyProgramData.programName}</h3>
                <p>Description: {loyaltyProgramData.description}</p>
                <p>Processing Time: {loyaltyProgramData.processingTime}</p>
                {/* Display exchange rate */}
                <p>1000 ABC Points = {loyaltyProgramData.currencyRate * 1000} {loyaltyProgramData.currencyName}</p>
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
                />
            </div>
    );
}

}

// // CSS style for the loyalty program box
// const loyaltyProgramStyle = {
//     border: '1px solid #ccc',
//     padding: '10px',
//     margin: '10px',
//     borderRadius: '5px',
//     backgroundColor: '#f9f9f9',
// };

export default LoyaltyProgram;