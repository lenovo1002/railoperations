import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('opens the admin login modal when the admin button is clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /admin login/i }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText(/login id/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
