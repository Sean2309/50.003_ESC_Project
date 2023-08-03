import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from '../../components/TransferForm';
import axios from 'axios';



// https://jestjs.io/docs/en/api#describename-fn
// good testing practices

describe('TransferForm Component', () => {
  const mockedUserId = 1;

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
    notificationMethod: "Bank",
    // Add other properties as needed for your test cases
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
    // Mock the axios.get function to return fake responses
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

  it('fail to render form when button is not yet clicked', async () => {

    await act(async () => {
      render(<TransferForm 
        membershipFormat={mockedTransferProps.membershipFormat}
        currencyRate={mockedTransferProps.currencyRate}
        userProfile={mockedUserProfile}
        loyaltyProgramId={mockedTransferProps.programId}
        />);
    });

    // indirect way to test if renderForm was called
    // to simulate how user would interact with the form
    expect(screen.getByTestId("member-name")).toBeInTheDocument();
    expect(screen.getByTestId("member-id")).toBeInTheDocument();
    expect(screen.getByTestId("member-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("transfer-amount")).toBeInTheDocument();
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
    const transferButton = screen.getByRole('button');
    fireEvent.click(transferButton);

    // user would now be able to see these
    expect(screen.getByTestId("member-name")).toBeInTheDocument();
    expect(screen.getByTestId("member-id")).toBeInTheDocument();
    expect(screen.getByTestId("member-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("transfer-amount")).toBeInTheDocument();
  });

    // render test is already on integration side. technically.
  // the integration's technically an indirect openModal testing ig
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

      // Find input fields and submit button
      const memberNameInput = screen.getByTestId('member-name').querySelector('input');
      const membershipIdInput = screen.getByTestId('member-id').querySelector('input');
      const membershipIdConfirmationInput = screen.getByTestId('member-confirm').querySelector('input');
      const transferAmountInput = screen.getByTestId('transfer-amount').querySelector('input');
      const submitButton = screen.getByTestId('submit-form').querySelector('input');

      // Fill in the form
      fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(membershipIdInput, { target: { value: '123456' } });
      fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456' } });
      fireEvent.change(transferAmountInput, { target: { value: '50' } });

      fireEvent.submit(submitButton);

    
    // await expect(screen.getByTestId('modal-dialog')).toHaveState('isOpen', false);
    await waitFor(() => expect(spy).not.toHaveBeenCalled());

    // https://github.com/jestjs/jest/issues/3821
  
  });
});