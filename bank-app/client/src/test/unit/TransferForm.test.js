import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from '../../components/TransferForm';
import axios from 'axios';


jest.mock('axios');

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
              loyaltyProgramId={mockedLoyaltyProgramData.programId}
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
              loyaltyProgramId={mockedLoyaltyProgramData.programId}
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
          loyaltyProgramId={mockedLoyaltyProgramData.programId}
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
        fireEvent.change(membershipIdInput, { target: { value: '123456789S' } });
        fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456789S' } });
        fireEvent.change(transferAmountInput, { target: { value: '50' } });

        fireEvent.submit(submitButton);

      await expect(spy).toHaveBeenCalled();

      // https://github.com/jestjs/jest/issues/3821
    
    });

      it('getDate was called after submission', async () => {
        // this is the button at the end of the loyalty program card

      const spy = jest.spyOn(TransferForm.prototype, 'getDate');
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
        fireEvent.change(membershipIdInput, { target: { value: '123456789S' } });
        fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456789S' } });
        fireEvent.change(transferAmountInput, { target: { value: '50' } });

        fireEvent.submit(submitButton);

      // getDate was called
      await expect(spy).toHaveBeenCalled();
    });
});