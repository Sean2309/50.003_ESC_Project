import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import LoyaltyProgram from '../../components/LoyaltyProgram';

describe('LoyaltyProgram Functions', () => {
  
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

    it('renders loyalty program data with correct datatypes', async () => {

      const rtl = render(<LoyaltyProgram key={mockedLoyaltyProgramData.programId} loyaltyProgramData={mockedLoyaltyProgramData} userProfile={mockedUserProfile}/>);


      await waitFor(() => {
        rtl.getByText("Enrollment Link", {exact: false});
      });

      expect(screen.getByText("GoJet Points")).toBeInTheDocument();
      expect(screen.getByText("Feel free to adjust this", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("Instant", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("1200", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("GoPoints", {exact: false})).toBeInTheDocument();
      // https://stackoverflow.com/questions/57827126/how-to-test-anchors-href-with-react-testing-library
      expect(screen.getByRole('link', { name: 'Enrollment Link' })).toHaveAttribute('href', 'https://www.gojet.com/member/');
      expect(screen.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html');
      expect(screen.getByRole('button', { name: 'Transfer' }));
    })

  });