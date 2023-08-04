import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import TransferForm from '../../components/TransferForm';
import axios from 'axios';

// easiest way is to partial the transferform with makesut
// https://blog.bitsrc.io/complete-guide-to-unit-tests-with-react-af6ed372244b

jest.mock('axios');

describe('TransferForm Component', () => {

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "88100110",
    notificationMethod: "Bank",
  };

  const mockedLoyaltyProgramData = 
  {
    programId: "GOPOINTS",
    programName: "GoJet Points",
    currencyName: "GoPoints",
    processingTime: "Instant",
    description: "Feel free to adjust this",
    enrollmentLink: "https://www.gojet.com/member/",
    tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
    membershipFormat: "^\\d{9}[a-zA-Z]$",
    currencyRate: 1.2
  }

  const submissionDate = new Date().toISOString().split('T')[0];

  // simulate successful response from sending POST request to TransferConnect API endpoint
  const mockServerSuccessfulResponse = {
    status: 201,
    data: {
      membershipId: '123456789S',
      memberName: 'John Doe',
      transferDate: submissionDate,
      transferAmount: "50",
      emailAddress: "abc@gmail.com",
      notificationMethod: "Bank",
      phoneNumber: "88100110",

    }
  };

    
  
  beforeEach(() => {
    
    // Need to mock axios.post here
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  // ensure that the transfer form is not covering the screen
  // until the user decides on one loyalty program's transfer form
  // and actually clicks on it
  it('fail to render form when button is not yet clicked', async () => {
    await act(async () => {
      render(<TransferForm 
        membershipFormat={mockedLoyaltyProgramData.membershipFormat}
        currencyRate={mockedLoyaltyProgramData.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedLoyaltyProgramData.programId}
        />);
    });

    // indirect way to test if renderForm was (not) called
    // to simulate how user would interact with the form
    // which is to say, the user should NOT be seeing any of these
    expect(screen.queryByTestId("member-name")).not.toBeInTheDocument();
    expect(screen.queryByTestId("member-id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("member-confirm")).not.toBeInTheDocument();
    expect(screen.queryByTestId("transfer-amount")).not.toBeInTheDocument();
  });

  it('renders form when button is clicked', async () => {
    await act(async () => {
      render(<TransferForm 
        membershipFormat={mockedLoyaltyProgramData.membershipFormat}
        currencyRate={mockedLoyaltyProgramData.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedLoyaltyProgramData.programId}
        />);
    });

    // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
    // User can see the transfer form button at the bottom page of the loyalty program
    const transferButton = screen.getByRole('button');
    fireEvent.click(transferButton);

    // user would now be able to see these
    expect(screen.getByTestId("member-name")).toBeInTheDocument();
    expect(screen.getByTestId("member-id")).toBeInTheDocument();
    expect(screen.getByTestId("member-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("transfer-amount")).toBeInTheDocument();
  });

    it('form submission sends axios POST request to transferConnect endpoint', async () => {
    axios.post.mockResolvedValueOnce(mockServerSuccessfulResponse);

    // since it is not clicked yet, this is still the button at the end of the loyalty program card
    render(<TransferForm 
      membershipFormat={mockedLoyaltyProgramData.membershipFormat}
      currencyRate={mockedLoyaltyProgramData.currencyRate}
      userProfile={mockedUserProfile}
      loyaltyProgramId={mockedLoyaltyProgramData.programId}
      />);

      
      // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
      const transferButton = screen.getByRole('button');
      // user opens transferForm
      fireEvent.click(transferButton);

      // User finds input fields and submit button
      const memberNameInput = screen.getByTestId('member-name').querySelector('input');
      const membershipIdInput = screen.getByTestId('member-id').querySelector('input');
      const membershipIdConfirmationInput = screen.getByTestId('member-confirm').querySelector('input');
      const transferAmountInput = screen.getByTestId('transfer-amount').querySelector('input');
      // const submitButton = screen.getByTestId('submit-button');
      const submitForm = screen.getByTestId('submit-form');

      // User fills in the form
      fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(membershipIdInput, { target: { value: '123456789S' } });
      fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456789S' } });
      fireEvent.change(transferAmountInput, { target: { value: '50' } });

      // User presses the submit button on the form
      submitForm.submit();

    
    await act(async () => {
      await waitFor(() => {
        // Assertions based on the API response (assuming success)
        expect(axios.post).toHaveBeenCalledWith(
          `http://localhost:3001/api/transferformsubmit/${mockedLoyaltyProgramData.programId}`,
          {
            membershipId: '123456789S',
            memberName: 'John Doe',
            transferDate: submissionDate,
            transferAmount: "50",
            emailAddress: "abc@gmail.com",
            phoneNumber: "88100110",
            notificationMethod: "Bank",
          },
          { withCredentials: true }
        );

          expect(axios.post).toHaveBeenCalledTimes(1);
        });
      });
    // https://github.com/jestjs/jest/issues/3821
  
  });
});