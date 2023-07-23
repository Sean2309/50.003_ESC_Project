import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axiosMock from './axiosMock'; // Mock axios for testing purposes
import TransferForm from './components/TransferForm';
import Marketplace from './views/Marketplace';
import LoyaltyPrograms from './components/LoyaltyPrograms';

// with learning from https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
// note that we're testing specifically from an enduser's perspective

// Mocked axios
// jest.mock('axios', () => axiosMock);

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
// https://stackoverflow.com/questions/74088726/react-testing-library-cant-find-an-element-with-a-text-even-though-its-in-the
// https://stackoverflow.com/questions/57623153/getting-error-while-jest-the-module-factory-of-jest-mock-is-not-allowed-to
// https://stackoverflow.com/questions/66465749/getting-axios-default-create-is-not-a-function-when-trying-to-test-a-componen
describe('TransferForm', () => {
  test('frontend displays the form fields correctly', () => {
    render(<TransferForm userProfile={{}} membershipFormat="" />);
    
    // Ensure that the input fields and submit button are present on the screen
    expect(screen.getByLabelText('Primary Cardholder Name: '),  {exact:false}).toBeInTheDocument();
    expect(screen.getByLabelText('Membership ID: '),  {exact:false}).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Membership ID: '),  {exact:false}).toBeInTheDocument();
    expect(screen.getByLabelText('Transfer Amount: '),  {exact:false}).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Transfer' }),  {exact:false}).toBeInTheDocument();
  });
});

// test('', () => {

// });