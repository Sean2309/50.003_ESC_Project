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

    const mockedTransferProps = 
        {
            membershipFormat: "^\\d{9}[a-zA-Z]$",
            loyaltyProgramId: "GOPOINTS",
            userProfile: mockedUserProfile,
            currencyRate: 1.2
        }
    ;

// for line 71
// axios.post = jest.fn().mockResolvedValue();
    // simulate successful response from sending POST request to TransferConnect API endpoint
    const mockServerSuccessfulResponse = {
        status: 201,
        data: {
            memberName: "mockUser",
            membershipId: "01",
            transferDate: "11-11-11",
            transferAmount: 2000,
            referenceNumber: "101",
            partnerCode: "mockApp",
            notificationMethod: "1",
            emailAddress: "mock@email.com",
            phoneNumber: "88100110",

        }
    };

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

    // both are only used on submit
    // tldr we can't unit test/spy on the functions without doing a submission
    // oh well, this is as close to a unitTest we have
    it('getDate doesnt get called without submission', async () => {
        const spy = jest.spyOn(TransferForm.prototype, 'getDate');
        await act(async () => {
          // it renders now!
            render(<TransferForm 
              membershipFormat={mockedTransferProps.membershipFormat}
              currencyRate={mockedTransferProps.currencyRate}
              userProfile={mockedUserProfile}
              loyaltyProgramId={mockedTransferProps.loyaltyProgramId}
              />);
          });
          
          // https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
          const transferButton = screen.getByRole('button');
          fireEvent.click(transferButton);

        await expect(spy).not.toHaveBeenCalled();
      
      });

      it('membershipValidation doesnt get called without submission', async () => {
        const spy = jest.spyOn(TransferForm.prototype, 'membershipValidation');
        await act(async () => {
          // it renders now!
            render(<TransferForm 
              membershipFormat={mockedTransferProps.membershipFormat}
              currencyRate={mockedTransferProps.currencyRate}
              userProfile={mockedUserProfile}
              loyaltyProgramId={mockedTransferProps.loyaltyProgramId}
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
          membershipFormat={mockedTransferProps.membershipFormat}
          currencyRate={mockedTransferProps.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedTransferProps.loyaltyProgramId}
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
          membershipFormat={mockedTransferProps.membershipFormat}
          currencyRate={mockedTransferProps.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedTransferProps.loyaltyProgramId}
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
      await expect(spy).toHaveReturned();

      // https://github.com/jestjs/jest/issues/3821
    
    });

});