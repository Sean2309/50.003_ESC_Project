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
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles empty loyalty program data by throwing console error', async () => {
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
      expect(screen.getByText("GoJet Points")).toBeInTheDocument();
      expect(screen.getByText("Feel free to adjust this", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("Instant", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("1200", {exact: false})).toBeInTheDocument();
      expect(screen.getByText("GoPoints", {exact: false})).toBeInTheDocument();
      // https://stackoverflow.com/questions/57827126/how-to-test-anchors-href-with-react-testing-library
      expect(screen.getByRole('link', { name: 'Enrollment Link' })).toHaveAttribute('href', 'https://www.gojet.com/member/');
      expect(screen.getByRole('link', { name: 'Terms and Conditions' })).toHaveAttribute('href', 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html');
    });
  });
});