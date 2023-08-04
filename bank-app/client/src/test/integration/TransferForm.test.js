import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import TransferForm from '../../components/TransferForm';
import axios from 'axios';

// easiest way is to partial the transferform with makesut
// https://blog.bitsrc.io/complete-guide-to-unit-tests-with-react-af6ed372244b

describe('TransferForm Component', () => {

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
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

  // for line 71
  // axios.post = jest.fn().mockResolvedValue();
  // yeah should do this ig?
  // check how axios.get is simulated
  // simulate successful response from sending POST request to TransferConnect API endpoint
  // const mockServerSuccessfulResponse = {
  //     status: 201,
  //     data: {
  //         memberName: "mockUser",
  //         membershipId: "01",
  //         transferDate: "11-11-11",
  //         transferAmount: 2000,
  //         referenceNumber: "101",
  //         partnerCode: "mockApp",
  //         notificationMethod: "1",
  //         emailAddress: "mock@email.com",
  //         phoneNumber: "88100110",

  //     }
  // };
  
  beforeEach(() => {
    jest.mock('axios');
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

  // this is an indirect openModal testing
  // from the viewpoint of a user
  it('user can submit the transfer form, no errors are logged', async () => {
    const spy = jest.spyOn(console, 'error');

    // this is still the button at the end of the loyalty program card
    const transferForm =
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


      // we can later check if axios.post is actually called on submit and that should be the end of our transferForm test


  // if need to test out axios post: https://stackoverflow.com/questions/47716844/how-do-you-verify-that-a-request-was-made-with-axios-mock-adapter/66564315#66564315
  // https://github.com/ctimmerm/axios-mock-adapter for mocking post.reply/response
  //   it('axios post was called after submission', async () => {
  //     // this is the button at the end of the loyalty program card

  //   const spy = jest.spyOn(axios, 'post');
  //   const transferForm =
  //     render(<TransferForm 
  //       membershipFormat={mockedLoyaltyProgramData.membershipFormat}
  //       currencyRate={mockedLoyaltyProgramData.currencyRate}
  //       userProfile={mockedUserProfile}
  //       loyaltyProgramId={mockedLoyaltyProgramData.loyaltyProgramId}
  //       />);

      
  //   // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
  //   const transferButton = screen.getByRole('button');
  //   // user opens transferForm
  //   fireEvent.click(transferButton);
  //   // check if modal is properly rendered
  //   expect(screen.getByTestId("modal-dialog")).toBeInTheDocument();

  //   // Find input fields and submit button
  //   const memberNameInput = screen.getByTestId('member-name').querySelector('input');
  //   const membershipIdInput = screen.getByTestId('member-id').querySelector('input');
  //   const membershipIdConfirmationInput = screen.getByTestId('member-confirm').querySelector('input');
  //   const transferAmountInput = screen.getByTestId('transfer-amount').querySelector('input');
  //   const submitButton = screen.getByTestId('submit-form').querySelector('input');

  //   // Fill in the form
  //   fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
  //   fireEvent.change(membershipIdInput, { target: { value: '123456' } });
  //   fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456' } });
  //   fireEvent.change(transferAmountInput, { target: { value: '50' } });

  //   await fireEvent.submit(submitButton);

  //   await expect(spy).toHaveBeenCalledWith();
  //   // getDate returns something!
  //   await expect(spy).toHaveReturned();

  // npm install axios-mock-adapter --save-dev
  // and then we can simulate axios post with this

  //   // https://github.com/jestjs/jest/issues/3821
  
  // });

});