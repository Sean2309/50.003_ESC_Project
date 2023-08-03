import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import LoyaltyProgram from '../../components/LoyaltyProgram';
import axios from 'axios';

// LoyaltyProgram.propTypes = {
//     loyaltyProgramData: PropTypes.shape({
//       programName: PropTypes.string.isRequired,
//       description: PropTypes.string.isRequired,
//       processingTime: PropTypes.string.isRequired,
//       currencyRate: PropTypes.number.isRequired,
//       currencyName: PropTypes.string.isRequired,
//       enrollmentLink: PropTypes.string.isRequired,
//       tncLink: PropTypes.string.isRequired,
//       programId: PropTypes.string.isRequired,
//       membershipFormat: PropTypes.string.isRequired,
//     }).isRequired,
//     userProfile: PropTypes.shape({}).isRequired,
//   };

describe('LoyaltyProgram Functions', () => {
  
    const mockedUserProfile = {
      abcPoints : 12367,
      emailAddress: "abc@gmail.com",
      phoneNumber: "3267352",
      notificationMethod: "Bank",
    };
  
    const mockedLoyaltyProgramData = [
      {
        programName: "GoJet Points",
        description: "Feel free to adjust this",
        processingTime: "Instant",
        currencyRate: 1.2,
        currencyName: "GoPoints",
        enrollmentLink: "https://www.gojet.com/member/",
        tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
        programId: "GOPOINTS",
        membershipFormat: "^\\d{9}[a-zA-Z]$",
      }
    ];
  
  
    it('handles empty loyalty program data by throwing console error', async () => {
  
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      // invalid types, will fail
      await act(async () => {
        render(<LoyaltyProgram loyaltyProgramData={[]} userProfile={[]}/>);
      });
      
      // received absolutely zero data
      // should trigger propTypes error
      await waitFor(() => expect(spy).toHaveBeenCalled());
  
    });
  
    // beforeEach(() => {
    //   jest.mock('axios');
    //   // Mock the axios.get function to return fake responses
    //   axios.get = jest.fn().mockResolvedValue((url) => {
    //     return Promise.reject(new Error('Invalid URL'));
    //   });
    // });
  
    // afterEach(() => {
    //   jest.clearAllMocks();
    // })
  
    // it('renders loyalty programs after data is fetched', async () => {
    //   // Render the LoyaltyPrograms component with mocked data
    //   const spy = jest.spyOn(LoyaltyPrograms.prototype, 'renderLoyaltyPrograms');
  
    //   await act(async () => {
    //     render(<LoyaltyProgram loyaltyProgramData={mockedLoyaltyProgramData} userProfile={mockedUserProfile}/>);
    //   });
      
    //   await expect(spy).toHaveBeenCalled();
  
    //   // Wait for the component to fetch data and re-render
  
    //   // Assert the loyalty program components are rendered
    //   expect(screen.getAllByTestId('loyaltyprograms-test')).toHaveLength(mockedLoyaltyPrograms.length);
  
    //   expect(screen.getByText('Loyalty Programs')).toBeInTheDocument();
  
    //   // note that loyalty program details like gojet points text etc will not be rendered in this test
    //   // because the component's nested inside loyalty programs logic
    //   // but it's a separate component
    //   // see this for details https://stackoverflow.com/questions/65618080/react-testing-library-nested-components-keep-parent-from-rendering-properly
    // });
  });