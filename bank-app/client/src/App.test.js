import { render, screen } from '@testing-library/react';
import Marketplace from './views/Marketplace';
import LoyaltyPrograms from './components/LoyaltyPrograms';

// with learning from https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
// note that we're testing specifically from an enduser's perspective

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


// test('', () => {

// });