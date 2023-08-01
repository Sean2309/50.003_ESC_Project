import React, { Component } from 'react';
import axios from 'axios';
import '../css/transfer-styles.css';

class TransferForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            membershipId: '',
            memberName: '',
            membershipIdConfirmation: '',
            transferAmount: '',
            isOpen: false // to render form as popup
        };
    }

    openModal = () => {
        this.setState({ isOpen: true });
    }

    closeModal = () => {
        this.setState({ isOpen: false });
    }

    // To return the current Date as a string
    getDate = () => {
        const currentDate = new Date();

        // To get date without time
        //currentDate.setHours(0, 0, 0, 0);

        // To keep only the date portion
        return currentDate.toISOString().split('T')[0];
    };


    // Returns true if membershipId is of correct format
    membershipValidation = (membershipId) => {
        // membershipFormat is stored as a regex expression in string format
        const { membershipFormat } = this.props;
        
        const regex = new RegExp(membershipFormat);
        
        return regex.test(membershipId);
    };

    handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behaviour

        const { membershipId, memberName, membershipIdConfirmation, transferAmount } = this.state;
        const { userProfile, loyaltyProgramId } = this.props;
        const { emailAddress, phoneNumber, notificationMethod } = userProfile

        const transferDate = this.getDate();
        
        
        if (membershipId === membershipIdConfirmation && this.membershipValidation(membershipId)){
            const form = {
                membershipId,
                memberName,
                transferDate,
                transferAmount,
                emailAddress,
                phoneNumber,
                notificationMethod
            };

            console.log(form);

            axios.post(`http://localhost:3001/api/transferformsubmit/${loyaltyProgramId}`, form)
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            // TODO if the membershipId is not valid or not of confirmation
            return;
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case 'transferAmount':
                const { abcPoints } = this.props.userProfile;
                // Make sure that the value entered does not exceed user's number of points
                if (parseInt(value) <= abcPoints || value === "") {
                    this.setState({ [name]: value });
                }
                break;

            default:
                this.setState({ [name]: value });
        }
    }
    
    handleTransferAmountKeyPress = (event) => {
        if (!"0123456789".includes(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
            // Prevent key from being entered
            event.preventDefault();
        }
    }

    renderForm = () => {
        const { memberName, membershipId, membershipIdConfirmation, transferAmount, isOpen } = this.state;
        if (!isOpen) {
            return <button onClick={this.openModal}>Transfer</button>
        }

        return (
            <div className='overlay' >
                <dialog open={isOpen}>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="memberName" data-testid = 'member-name'>Primary Cardholder Name: </label>
                        <input
                            type="text"
                            id="memberName"
                            name="memberName"
                            value={memberName}
                            onChange={this.handleChange}
                            required
                        />
                        <br />

                        <label htmlFor="membershipId" data-testid = 'member-id'>Membership ID: </label>
                        <input
                            type="text"
                            id="membershipId"
                            name="membershipId"
                            value={membershipId}
                            onChange={this.handleChange}
                            required
                        />
                        <br />

                        <label htmlFor="membershipIdConfirmation" data-testid = 'member-confirm'>Confirm Membership ID: </label>
                        <input
                            type="text"
                            id="membershipIdConfirmation"
                            name="membershipIdConfirmation"
                            value={membershipIdConfirmation}
                            onChange={this.handleChange}
                            required
                        />
                        <br />

                        <label htmlFor="transferAmount" data-testid = 'transfer-amount'>Transfer Amount: </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="transferAmount"
                            name="transferAmount"
                            value={transferAmount}
                            onChange={this.handleChange}
                            onKeyDown={this.handleTransferAmountKeyPress}
                            required
                        />
                        <br />

                        <input
                            type="submit"
                            value="Submit"
                        />
                    </form>
                    <button onClick={this.closeModal}>Close</button>
                </dialog>
            </div>

        );
    }

    render() {
        return (
            <div>
                <this.renderForm />
            </div>
        );
    }
}

export default TransferForm;
