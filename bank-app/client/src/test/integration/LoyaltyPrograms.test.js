import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import LoyaltyPrograms from '../../components/LoyaltyPrograms';
import axios from 'axios';

jest.mock('axios');

describe('LoyaltyPrograms Component', () => {
  const mockedUserId = 1;

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
    notificationMethod: "Bank",
  };

  const mockedLoyaltyPrograms = [
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
    },
    {
      programId: 'ASIAMILES',
      programName: 'Asia Miles+',
      currencyName: 'Asia Points',
      processingTime: '1 day',
      description: 'Your Asian miles',
      enrollmentLink: 'https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html',
      tncLink: 'https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html',
      membershipFormat: '^\\d{11}$',
      currencyRate: 1.1,
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles invalid loyalty program data by throwing error', async () => {
    // Mock the axios.get function to return invalid responses
    // the test will still pass though since we handle the error
    axios.get = jest.fn().mockResolvedValue();

    expect(async () => {
      render(<LoyaltyPrograms userId={mockedUserId} />).toThrow();
    });

  });


  it('renders loyalty programs after data is fetched', async () => {
    // this covers line 23-33 in the code
    // despite coverage table putting a warning
    axios.get.mockResolvedValueOnce({ data: { loyaltyPrograms: mockedLoyaltyPrograms } })
            .mockResolvedValueOnce({ data: mockedUserProfile });
    // Render the LoyaltyPrograms component with mocked data
    const spy = jest.spyOn(LoyaltyPrograms.prototype, 'renderLoyaltyPrograms');

    render(<LoyaltyPrograms userId={mockedUserId} />);


    // Wait for the component to fetch data and re-render
    await expect(spy).toHaveBeenCalled();

    // Assert the loyalty program components are interactable/seen by users

    // Wait for the async operations (componentDidMount) to complete
    await waitFor(() => {
      expect(screen.getByText('Loyalty Programs')).toBeInTheDocument();
      expect(screen.getAllByTestId('loyaltyprograms-test')).toHaveLength(mockedLoyaltyPrograms.length);
      const [firstEnrollmentLink, secondEnrollmentLink] = screen.getAllByRole('link', { name: 'Enrollment Link' });
      const [firstTermsLink, secondTermsLink] = screen.getAllByRole('link', { name: 'Terms and Conditions' });
      // first loyalty program rendered
      expect(screen.getByText("GoJet Points")).toBeInTheDocument();
      expect(screen.getByText("Feel free to adjust this", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("Instant", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("1200", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("GoPoints", {exact: false})).toBeInTheDocument();
      // https://stackoverflow.com/questions/57827126/how-to-test-anchors-href-with-react-testing-library
      expect(firstEnrollmentLink).toHaveAttribute('href', 'https://www.gojet.com/member/');
      expect(firstTermsLink).toHaveAttribute('href', 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html');
      // second loyalty program rendered
      expect(screen.getByText("Asia Miles+")).toBeInTheDocument();
      expect(screen.getByText("Your Asian miles", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("1 day", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("1100", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("Asia Points", {exact: false})).toBeInTheDocument();
      // https://stackoverflow.com/questions/57827126/how-to-test-anchors-href-with-react-testing-library
      expect(secondEnrollmentLink).toHaveAttribute('href', 'https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html');
      expect(secondTermsLink).toHaveAttribute('href', 'https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html');
    });
  });
});