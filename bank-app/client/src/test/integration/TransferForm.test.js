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

  const mockedTransferProps = [
    {
        membershipFormat: "^\\d{9}[a-zA-Z]$",
        loyaltyProgramId: "GOPOINTS",
        userProfile: mockedUserProfile,
        currencyRate: 1.2
    }
  ];



//   it('handles empty loyalty program data by throwing console error', async () => {
//     // Mock the axios.get function to return invalid responses
//     axios.get = jest.fn().mockResolvedValue();

//     const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

//     await act(async () => {
//       render(<LoyaltyPrograms userId={mockedUserId} />);
//     });
    
//     // received absolutely zero data
//     await waitFor(() => expect(spy).toHaveBeenCalled());

//   });

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

  it('fail to render form when button is not clicked', async () => {

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

  // this will be broken for now
  // TODO: fix this
  it('renders form when button is clicked', async () => {
    // should simulate the transfer form button click

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

    // need to simulate fireEvent button for not failing case
    // user would only see these
    expect(screen.getByTestId("member-name")).toBeInTheDocument();
    expect(screen.getByTestId("member-id")).toBeInTheDocument();
    expect(screen.getByTestId("member-confirm")).toBeInTheDocument();
    expect(screen.getByTestId("transfer-amount")).toBeInTheDocument();
  });
});