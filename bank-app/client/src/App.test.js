import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from './components/TransferForm';
import Marketplace from './views/Marketplace';
import LoyaltyPrograms from './components/LoyaltyPrograms';
const axios = require('axios');

// with learning from https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
// note that we're testing specifically from an enduser's perspective

// Mocked axios
// jest.mock('axios', () => axiosMock);

jest.mock('axios');

test('renders marketplace', () => {
  render(<Marketplace />);
  const linkElement = screen.getByTestId("marketplace-container-test");
  expect(linkElement).toBeInTheDocument();
});
// login test is in todo.test.js
test('renders loyalty program interaction', () => {
  render(<LoyaltyPrograms />);
  const linkElement = screen.getByTestId("loyaltyprograms-test");
  expect(linkElement).toBeInTheDocument();
});

// doesn't work yet due to button shenanigans
// and axios testing has issues
// I'll discuss later with transfer form people
// https://stackoverflow.com/questions/74088726/react-testing-library-cant-find-an-element-with-a-text-even-though-its-in-the
// https://stackoverflow.com/questions/57623153/getting-error-while-jest-the-module-factory-of-jest-mock-is-not-allowed-to
// https://stackoverflow.com/questions/66465749/getting-axios-default-create-is-not-a-function-when-trying-to-test-a-componen
describe('TransferForm', () => {
  test('frontend displays the form fields correctly', () => {
    render(<TransferForm userProfile={{}} membershipFormat="" />);
    
    // Ensure that the input fields and submit button are present on the screen
    expect(screen.getByTestId('member-name'),  {exact:false}).toBeInTheDocument();
    expect(screen.getByTestId('member-id'),  {exact:false}).toBeInTheDocument();
    expect(screen.getByTestId('member-confirm'),  {exact:false}).toBeInTheDocument();
    expect(screen.getByTestId('transfer-amount'),  {exact:false}).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Transfer' }),  {exact:false}).toBeInTheDocument();
  });
});

// test('', () => {

// });


// loyaltyprogram setstates
// unfinished as jest is complaining about wrapping setstate triggers in act()
// but the documentation is deprecated? confused
describe ('Unit Tests', () => {

  test ('1. fetches loyalty programs and sets state correctly', async() => {
     // Mocking the data returned by the find method
     const mockedResponseData = [
      {
          programId: "GOPOINTS",
          programName: "GoJet Points",
          currencyName: "GoPoints",
          processingTime: "Instant",
          description: "Feel free to adjust this",
          enrollmentLink: "https://www.gojet.com/member/",
          tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
          membershipFormat: "^\\d{9}[a-zA-Z]$",
          currencyRate: 1
      },
      
    ];
    axios.get.mockResolvedValue({ data: mockedResponseData});


    render(<LoyaltyPrograms></LoyaltyPrograms>)

    // Call the getLoyaltyPrograms function
    const componentInstance = screen.getByTestId('loyaltyprograms-test');
    await componentInstance.getLoyaltyPrograms();

    expect(componentInstance.state.loyaltyProgramsData).toEqual(mockResponse.data.loyaltyPrograms);
  });
  
});
