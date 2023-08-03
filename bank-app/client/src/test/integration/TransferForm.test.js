import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from '../../components/TransferForm';
import axios from 'axios';

// https://jestjs.io/docs/en/api#describename-fn
// good testing practices

describe('TransferForm Component', () => {

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
    notificationMethod: "Bank",
  };

  const mockedTransferProps =
    {
        membershipFormat: "^\\d{9}[a-zA-Z]$",
        loyaltyProgramId: "GOPOINTS",
        userProfile: mockedUserProfile,
        currencyRate: 1.2
    }
  ;
  
  beforeEach(() => {
    jest.mock('axios');
    // Mock the axios.get function to return responses according to url called
    axios.get = jest.fn().mockResolvedValue((url) => {
      if (url === 'http://localhost:3001/api/userprofile') {
        return { data: mockedUserProfile };
      } else if (url === 'http://localhost:3001/api/loyaltyprograms') {
        return { data: { loyaltyPrograms: mockedLoyaltyPrograms } };
      }
      return Promise.reject(new Error('Invalid URL'));
    });
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
        membershipFormat={mockedTransferProps.membershipFormat}
        currencyRate={mockedTransferProps.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedTransferProps.programId}
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
        membershipFormat={mockedTransferProps.membershipFormat}
        currencyRate={mockedTransferProps.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedTransferProps.programId}
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

  // this is an indirect openModal testing
  // from the viewpoint of a user
  it('user can submit the transfer form, no errors are logged', async () => {
    const spy = jest.spyOn(console, 'error');

    // this is still the button at the end of the loyalty program card
    const transferForm =
      render(<TransferForm 
        membershipFormat={mockedTransferProps.membershipFormat}
        currencyRate={mockedTransferProps.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedTransferProps.loyaltyProgramId}
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
      const submitButton = screen.getByTestId('submit-form').querySelector('input');

      // User fills in the form
      fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(membershipIdInput, { target: { value: '123456' } });
      fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456' } });
      fireEvent.change(transferAmountInput, { target: { value: '50' } });

      // User presses the submit button on the form
      fireEvent.submit(submitButton);
    
    await waitFor(() => expect(spy).not.toHaveBeenCalled());

    // https://github.com/jestjs/jest/issues/3821
  
  });
});