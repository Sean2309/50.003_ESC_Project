import PropTypes from 'prop-types';
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
      isOpen: false, // to render form as popup
      submissionStatus: ''
    };
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  // To return the current Date as a string
  getDate() {
    const currentDate = new Date();

    // To get date without time
    // currentDate.setHours(0, 0, 0, 0);

    // To keep only the date portion
    return currentDate.toISOString().split('T')[0];
  };

  // Returns true if membershipId is of correct format
  membershipValidation(membershipId) {
    // membershipFormat is stored as a regex expression in string format
    const { membershipFormat } = this.props;

    const regex = new RegExp(membershipFormat);

    return regex.test(membershipId);
  };

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behaviour

    const {
      membershipId, memberName, membershipIdConfirmation, transferAmount,
    } = this.state;
    const { userProfile, loyaltyProgramId, updateUserProfile } = this.props;
    const { emailAddress, phoneNumber, notificationMethod } = userProfile;

    const transferDate = this.getDate();

    if (membershipId !== membershipIdConfirmation) {
      this.setState({ submissionStatus: 'membershipIdConfirmation' });
    }
    else if (!this.membershipValidation(membershipId)) {
      this.setState({ submissionStatus: 'membershipIdValidation' });
    }
    else {
      const form = {
        membershipId,
        memberName,
        transferDate,
        transferAmount,
        emailAddress,
        phoneNumber,
        notificationMethod,
      };

      // withCredentials
      // 
      axios.post(`http://localhost:3001/api/transferformsubmit/${loyaltyProgramId}`, form, { withCredentials: true })
        .then((response) => {
          this.setState({ submissionStatus: 'success' });
          updateUserProfile();
        })
        .catch((error) => {
          this.setState({ submissionStatus: 'failure' });
        });

      //TODO: change userProfile points value
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'transferAmount': {
        const { userProfile } = this.props;
        const { abcPoints } = userProfile;
        // Make sure that the value entered does not exceed user's number of points
        if (parseInt(value, 10) <= abcPoints || value === '') {
          this.setState({ [name]: value });
        }
        break;
      }
      default:
        this.setState({ [name]: value });
    }
  };

  handleTransferAmountKeyPress = (event) => {
    if (!'0123456789'.includes(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
      // Prevent key from being entered
      event.preventDefault();
    }
  };

  renderSuccess = () => {
    const { submissionStatus } = this.state;
    const { userProfile } = this.props;
    const { abcPoints } = userProfile;
    return (
      <div>
        {submissionStatus === 'success' ? (
          <div>Transaction submitted successfully! You have {abcPoints} left!</div>
        ) : submissionStatus === 'membershipIdValidation' ? (
          <div>Incorrect Membership ID format.</div>
        ) : submissionStatus === 'membershipIdConfirmation' ? (
          <div>Membership ID did not match.</div>
        ) : submissionStatus === 'failure' ? (
          <div>Something went wrong, please try again.</div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  renderForm = () => {
    const {
      memberName, membershipId, membershipIdConfirmation, transferAmount, isOpen,
    } = this.state;
    if (!isOpen) {
      return <button onClick={this.openModal} type="button">Transfer</button>;
    }

    return (
      <div className="overlay">
        <dialog open={isOpen} data-testid="modal-dialog">
          <form onSubmit={this.handleSubmit} data-testid="submit-form">
            <label htmlFor="memberName" data-testid="member-name">
              Primary Cardholder Name:
              <input
                type="text"
                id="memberName"
                name="memberName"
                value={memberName}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />

            <label htmlFor="membershipId" data-testid="member-id">
              Membership ID:
              <input
                type="text"
                id="membershipId"
                name="membershipId"
                value={membershipId}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />

            <label htmlFor="membershipIdConfirmation" data-testid="member-confirm">
              Confirm Membership ID:
              <input
                type="text"
                id="membershipIdConfirmation"
                name="membershipIdConfirmation"
                value={membershipIdConfirmation}
                onChange={this.handleChange}
                required
              />
            </label>
            <br />

            <label htmlFor="transferAmount" data-testid="transfer-amount">
              Transfer Amount:
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
            </label>
            <br />

            <input data-testid="submit-button"
              type="submit"
              value="Submit"
            />

            {/* <button data-testid="submit-button"
              type="submit"
              value="Submit"
            /> */}
          </form>
          <button onClick={this.closeModal} type="button">Close</button>

          {this.renderSuccess()}
        </dialog>
      </div>

    );
  };

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }
}

// PropTypes validation
TransferForm.propTypes = {
  membershipFormat: PropTypes.string.isRequired,
  userProfile: PropTypes.shape({
    abcPoints: PropTypes.number.isRequired,
    emailAddress: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    notificationMethod: PropTypes.string.isRequired,
  }).isRequired,
  loyaltyProgramId: PropTypes.string.isRequired,
};

export default TransferForm;
