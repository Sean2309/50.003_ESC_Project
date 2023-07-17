import React, { Component } from 'react';
import TransferForm from './TransferForm';

class LoyaltyProgram extends Component {

    render() {
        const { data } = this.props;

        console.log(data);

        return (
            <div style={loyaltyProgramStyle}>
                <h3>{data.programName}</h3>
                <p>Description: {data.description}</p>
                <p>Currency: {data.currencyName}</p>
                <p>Processing Time: {data.processingTime}</p>
                <p>
                    <a href={data.enrollmentLink}>Enrollment Link</a>
                </p>
                <p>
                    <a href={data.tncLink}>Terms and Conditions</a>
                </p>
                <p>
                    <TransferForm />
                </p>
            </div>
        );
    }

}

// CSS style for the loyalty program box
const loyaltyProgramStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
};

export default LoyaltyProgram;