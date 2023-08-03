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
  
    const mockedLoyaltyProgramData = 
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
    ;
  
  
    it('handles empty loyalty program data by throwing console error', async () => {
      // invalid types, will fail

      const spy = jest.spyOn(console, 'error');

      await act(async () => {
        render(<LoyaltyProgram loyaltyProgramData={[]} userProfile={[]}/>);
      });
      
      // received absolutely zero data
      // should trigger propTypes error
      await waitFor(() => expect(spy).toHaveBeenCalled());
    });

    it('renders loyalty program data with correct datatypes', async () => {

      const rtl = render(<LoyaltyProgram loyaltyProgramData={mockedLoyaltyProgramData} userProfile={mockedUserProfile}/>);


      await waitFor(() => {
        rtl.getByText("Enrollment Link", {exact: false});
      });

      console.log(mockedLoyaltyProgramData.description)

      expect(rtl.getByText("Description:", {exact: false})).toBeInTheDocument();
      expect(rtl.getByText("Processing Time:", {exact: false})).toBeInTheDocument();
      expect(rtl.getByText("1000 ABC Points =", {exact: false})).toBeInTheDocument();
      
    })

  });