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

test('authenticates the admin and stores the returned token', async () => {
  const mockFetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'jwt-token' }) })
    .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  global.fetch = mockFetch;

  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /admin login/i }));
  fireEvent.change(screen.getByLabelText(/login id/i), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

  expect(mockFetch).toHaveBeenCalledWith(
    '/admin/authenticate',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password' }),
    })
  );
});

test('shows trip start and end time fields in the add duty form', () => {
  render(<AdminPage onLogout={() => {}} adminToken="mock-token" />);

  fireEvent.click(screen.getByRole('button', { name: /add duty/i }));

  expect(screen.getByLabelText(/trip start time/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/trip end time/i)).toBeInTheDocument();
});

test('renders the requested location options in the add duty form', () => {
  render(<AdminPage onLogout={() => {}} adminToken="mock-token" />);

  fireEvent.click(screen.getByRole('button', { name: /add duty/i }));

  expect(screen.getByRole('option', { name: /RHD/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /CVC UP/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /SGT UP/i })).toBeInTheDocument();
});

test('submits the duty form payload to the backend when the form is submitted', async () => {
  const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  global.fetch = mockFetch;

  render(<AdminPage onLogout={() => {}} adminToken="mock-token" />);

  fireEvent.click(screen.getByRole('button', { name: /add duty/i }));

  fireEvent.change(screen.getByLabelText(/duty no/i), { target: { value: '120' } });
  fireEvent.change(screen.getByLabelText(/sign on time/i), { target: { value: '04:25' } });
  fireEvent.change(screen.getByLabelText(/sign on location/i), { target: { value: 'RHD' } });
  fireEvent.change(screen.getByLabelText(/sign off time/i), { target: { value: '12:00' } });
  fireEvent.change(screen.getByLabelText(/sign off location/i), { target: { value: 'RHD' } });
  fireEvent.change(screen.getByLabelText(/train no/i), { target: { value: '101' } });
  fireEvent.change(screen.getByLabelText(/break time/i), { target: { value: '00:42' } });
  fireEvent.change(screen.getByLabelText(/trip from/i), { target: { value: 'CVC_UP' } });
  fireEvent.change(screen.getByLabelText(/trip to/i), { target: { value: 'CVC_DN' } });
  fireEvent.change(screen.getByLabelText(/trip start time/i), { target: { value: '06:24' } });
  fireEvent.change(screen.getByLabelText(/trip end time/i), { target: { value: '07:45' } });

  fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form'));

  expect(mockFetch).toHaveBeenCalledWith(
    '/tripchart/addtrip',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      }),
    })
  );
});
