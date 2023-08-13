import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from '../../components/TransferForm';
import StringFuzzer from '../StringFuzzer';
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

      // the tests pass fine
      // unfortunately, there will be issues with the act warning
      // due to a bug from react that is not yet fixed
      // https://github.com/testing-library/react-testing-library/issues/1061
      // so for clarity purposes we filter out that error
      const originalError = console.error.bind(console.error)
      beforeAll(() => {
        console.error = (msg) => 
          !msg.toString().includes('act(...)') && originalError(msg)
      })
      afterAll(() => {
        console.error = originalError
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
        const submitForm = screen.getByTestId('submit-form');

        // Fill in the form
        fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
        fireEvent.change(membershipIdInput, { target: { value: '123456789S' } });
        fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456789S' } });
        fireEvent.change(transferAmountInput, { target: { value: '50' } });

        act(() => {
          submitForm.submit();
          });

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
        const submitForm = screen.getByTestId('submit-form');

        // Fill in the form
        fireEvent.change(memberNameInput, { target: { value: 'John Doe' } });
        fireEvent.change(membershipIdInput, { target: { value: '123456789S' } });
        fireEvent.change(membershipIdConfirmationInput, { target: { value: '123456789S' } });
        fireEvent.change(transferAmountInput, { target: { value: '50' } });

        act(() => {
          submitForm.submit();
          });

      // getDate was called
      await expect(spy).toHaveBeenCalled();
    });

    it('membershipValidation: fuzzing random format membershipId (membershipIdConfirmation is the same value)', async () => {

      const fuzzer = new StringFuzzer(mockedLoyaltyProgramData.membershipFormat, mockedUserProfile.abcPoints);
      const fuzzMembershipId = fuzzer.generateRandomMembershipId(Math.random()*50);
      const regex = new RegExp(mockedLoyaltyProgramData.membershipFormat);
  
      // since it is not clicked yet, this is still the button at the end of the loyalty program card
      await act(async () => {
        render(<TransferForm 
          membershipFormat={mockedLoyaltyProgramData.membershipFormat}
          currencyRate={mockedLoyaltyProgramData.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedLoyaltyProgramData.programId}
          />);
      });
        
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
        // invalid membershipId
        fireEvent.change(membershipIdInput, { target: { value: fuzzMembershipId } });
        fireEvent.change(membershipIdConfirmationInput, { target: { value: fuzzMembershipId } });
        fireEvent.change(transferAmountInput, { target: { value: '50' } });
  
        // User presses the submit button on the form
        // console.log(fuzzMembershipId);
        act(() => {
          submitForm.submit();
          });
        await waitFor(() => {
            if (regex.test(fuzzMembershipId) == false) {
              expect(axios.post).not.toHaveBeenCalled();
            }
            else if (regex.test(fuzzMembershipId) == true) {
              expect(axios.post).toHaveBeenCalled();
            }
          });
    });

    it('membershipValidation: fuzzing random format membershipId and membershipIdConfirmation', async () => {
      const fuzzer = new StringFuzzer(mockedLoyaltyProgramData.membershipFormat, mockedUserProfile.abcPoints);
      const fuzzMembershipId = fuzzer.generateRandomMembershipId(Math.random()*50);
      const fuzzMembershipIdConfirmation = fuzzer.generateRandomMembershipId(Math.random()*50);
      const regex = new RegExp(mockedLoyaltyProgramData.membershipFormat);
  
      // since it is not clicked yet, this is still the button at the end of the loyalty program card
      await act(async () => {
        render(<TransferForm 
          membershipFormat={mockedLoyaltyProgramData.membershipFormat}
          currencyRate={mockedLoyaltyProgramData.currencyRate}
          userProfile={mockedUserProfile}
          loyaltyProgramId={mockedLoyaltyProgramData.programId}
          />);
      });
        
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
      // invalid membershipId
      fireEvent.change(membershipIdInput, { target: { value: fuzzMembershipId } });
      fireEvent.change(membershipIdConfirmationInput, { target: { value: fuzzMembershipIdConfirmation } });
      fireEvent.change(transferAmountInput, { target: { value: '50' } });

      // User presses the submit button on the form
      // console.log(fuzzMembershipId);
      act(() => {
        submitForm.submit();
        });
      await waitFor(() => {
        if (regex.test(fuzzMembershipId) == false || fuzzMembershipId!=fuzzMembershipIdConfirmation) {
          expect(axios.post).not.toHaveBeenCalled();
        }
        // tbh this can just be an else, but it's clearer this way
        else if (regex.test(fuzzMembershipId) == true && fuzzMembershipId==fuzzMembershipIdConfirmation) {
          expect(axios.post).toHaveBeenCalled();
        }
      });
    });
});