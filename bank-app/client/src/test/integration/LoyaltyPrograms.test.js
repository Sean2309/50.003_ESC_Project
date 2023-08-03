import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import LoyaltyPrograms from '../../components/LoyaltyPrograms';
import axios from 'axios';



// https://jestjs.io/docs/en/api#describename-fn
// good testing practices

describe('LoyaltyPrograms Component', () => {
  const mockedUserId = 1;

  const mockedUserProfile = {
    abcPoints : 12367,
    emailAddress: "abc@gmail.com",
    phoneNumber: "3267352",
    notificationMethod: "Bank",
    // Add other properties as needed for your test cases
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



  it('handles empty loyalty program data by throwing console error', async () => {
    // Mock the axios.get function to return invalid responses
    // Intended action: console.error shows the issue
    // the test will still pass though since we handle the error
    axios.get = jest.fn().mockResolvedValue();

    const spy = jest.spyOn(console, 'error');

    await act(async () => {
      render(<LoyaltyPrograms userId={mockedUserId} />);
    });
    
    // received absolutely zero data
    await waitFor(() => expect(spy).toHaveBeenCalled());

  });

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

  it('renders loyalty programs after data is fetched', async () => {
    // Render the LoyaltyPrograms component with mocked data
    const spy = jest.spyOn(LoyaltyPrograms.prototype, 'renderLoyaltyPrograms');

    await act(async () => {
      render(<LoyaltyPrograms userId={mockedUserId} />);
    });

    
    await expect(spy).toHaveBeenCalled();

    // Wait for the component to fetch data and re-render

    // Assert the loyalty program components are rendered
    expect(screen.getAllByTestId('loyaltyprograms-test')).toHaveLength(mockedLoyaltyPrograms.length);

    expect(screen.getByText('Loyalty Programs')).toBeInTheDocument();

    // note that loyalty program details like gojet points text etc will not be rendered in this test
    // because the component's nested inside loyalty programs logic
    // but it's a separate component
    // see this for details https://stackoverflow.com/questions/65618080/react-testing-library-nested-components-keep-parent-from-rendering-properly
  });
});