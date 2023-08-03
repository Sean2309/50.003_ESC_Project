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

    const mockedTransferProps = [
        {
            membershipFormat: "^\\d{9}[a-zA-Z]$",
            loyaltyProgramId: "GOPOINTS",
            userProfile: mockedUserProfile,
            currencyRate: 1.2
        }
    ];

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

    // TODO unit test: 
    // openModal
    // closeModal
    // ^with fireEvent, check if called
    // or ig findbytestid the overlay background



    // getDate
    // just check return value

    it('getDate is called', async () => {
        const spy = jest.spyOn(TransferForm.prototype, 'getDate');
        // TODO: just manually pass in 
        await act(async () => {
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

        await expect(spy).toHaveBeenCalled();
      
      });

        

    // membershipValidation
    // create fuzzer for this ig
    
    // handleSubmit
    // test preventDefault is called
    // test axios post aka line 71

    // handleChange
    // not much to unit test, can shove to integration testing

    // handleTransferAmountKeyress
    // ...simulate user input?
    // can just fuzz an event
    // and see if it gets called

    // check if overlay is there in integration

});