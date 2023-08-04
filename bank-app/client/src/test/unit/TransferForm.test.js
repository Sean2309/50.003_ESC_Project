import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from '../../components/TransferForm';
import axios from 'axios';



describe('TransferForm Component', () => {
  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
    notificationMethod: "Bank",
  };

  // not an array!
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
  ;

    beforeEach(() => {
        jest.mock('axios');
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      })

    it('getDate will not get called without submission', async () => {
        const spy = jest.spyOn(TransferForm.prototype, 'getDate');
        await act(async () => {
          // it renders now!
            render(<TransferForm 
              membershipFormat={mockedLoyaltyProgramData.membershipFormat}
              currencyRate={mockedLoyaltyProgramData.currencyRate}
              userProfile={mockedUserProfile}
              loyaltyProgramId={mockedLoyaltyProgramData.loyaltyProgramId}
              />);
          });
          
          // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
          const transferButton = screen.getByRole('button');
          fireEvent.click(transferButton);

        await expect(spy).not.toHaveBeenCalled();
      
      });

      it('membershipValidation will not get called without submission', async () => {
        const spy = jest.spyOn(TransferForm.prototype, 'membershipValidation');
        await act(async () => {
          // it renders now!
            render(<TransferForm 
              membershipFormat={mockedLoyaltyProgramData.membershipFormat}
              currencyRate={mockedLoyaltyProgramData.currencyRate}
              userProfile={mockedUserProfile}
              loyaltyProgramId={mockedLoyaltyProgramData.loyaltyProgramId}
              />);
          });
          
          // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
          const transferButton = screen.getByRole('button');
          fireEvent.click(transferButton);

        await expect(spy).not.toHaveBeenCalled();
      
      });

      it('membershipValidation was called after submission', async () => {
        // this is the button at the end of the loyalty program card

      const spy = jest.spyOn(TransferForm.prototype, 'membershipValidation');
      const transferForm =
        render(<TransferForm 
          membershipFormat={mockedLoyaltyProgramData.membershipFormat}
          currencyRate={mockedLoyaltyProgramData.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedLoyaltyProgramData.loyaltyProgramId}
          />);

        
        // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
        const transferButton = screen.getByRole('button');
        // user opens transferForm
        fireEvent.click(transferButton);
        // check if modal is properly rendered
        expect(screen.getByTestId("modal-dialog")).toBeInTheDocument();

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

      await expect(spy).toHaveBeenCalled();

      // https://github.com/jestjs/jest/issues/3821
    
    });

      it('getDate was called after submission', async () => {
        // this is the button at the end of the loyalty program card

      const spy = jest.spyOn(TransferForm.prototype, 'getDate');
      const transferForm =
        render(<TransferForm 
          membershipFormat={mockedLoyaltyProgramData.membershipFormat}
          currencyRate={mockedLoyaltyProgramData.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedLoyaltyProgramData.loyaltyProgramId}
          />);

        
        // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
        const transferButton = screen.getByRole('button');
        // user opens transferForm
        fireEvent.click(transferButton);
        // check if modal is properly rendered
        expect(screen.getByTestId("modal-dialog")).toBeInTheDocument();

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

      // getDate was called
      await expect(spy).toHaveBeenCalled();
      // getDate returns something!
      // yeah it's the result spying we need to check later
      await expect(spy).toHaveReturned();

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