import { component$, useStore, $ } from '@builder.io/qwik';

const ForgotPassword = component$(() => {
  const form = useStore({ email: '', success: '', error: '' });

  const handleSubmit = $(async () => {
    form.success = '';
    form.error = '';
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      res.ok ? form.success = data.message : form.error = data.message;
    } catch {
      form.error = 'Server unreachable';
    }
  });

  return (
    <>
      <h2>Forgot Password</h2>
      <input type="email" value={form.email} onInput$={(e) => form.email = (e.target as HTMLInputElement).value} placeholder="Enter your email" />
      <button onClick$={handleSubmit}>Send Reset Link</button>
      {form.success && <p style={{ color: 'green' }}>{form.success}</p>}
      {form.error && <p style={{ color: 'red' }}>{form.error}</p>}
    </>
  );
});

export default ForgotPassword;
