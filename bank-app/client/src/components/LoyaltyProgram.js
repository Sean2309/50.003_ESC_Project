import React, { Component } from 'react';
import TransferForm from './TransferForm';
import '../css/loyalty-styles.css';

class LoyaltyProgram extends Component {

    render() {
        const { data } = this.props;

        console.log(data);

        return (
            <div className='loyalty-box'>
                <h3>{data.programName}</h3>
                <p>Description: {data.description}</p>
                <p>Processing Time: {data.processingTime}</p>
                {/* Display exchange rate */}
                <p>1000 ABC Points = {data.currencyRate * 1000} {data.currencyName}</p>
                <p>
                    <a href={data.enrollmentLink}>Enrollment Link</a>
                </p>
                <p>
                    <a href={data.tncLink}>Terms and Conditions</a>
                </p>
                {/* pass currencyRate and formatting to TransferForm */}
                <TransferForm membershipFormat={data.membershipFormat} currencyRate={data.currencyRate} />
            </div>
    );
}

}