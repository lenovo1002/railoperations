import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import AdminPage from './components/AdminPage';

test('opens the admin login modal when the admin button is clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /admin login/i }));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText(/login id/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('shows trip start and end time fields in the add duty form', () => {
  render(<AdminPage onLogout={() => {}} />);

  fireEvent.click(screen.getByRole('button', { name: /add duty/i }));

  expect(screen.getByLabelText(/trip start time/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/trip end time/i)).toBeInTheDocument();
});
