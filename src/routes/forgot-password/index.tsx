import { component$, useStore, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import './forgot-password.css';

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
    <div class="forgot-password-container">
      <h2>Mot de passe oublié</h2>
      <div class="forgot-form">
        <div class="input-group">
          <input 
            type="email" 
            value={form.email} 
            onInput$={(e) => form.email = (e.target as HTMLInputElement).value} 
            placeholder="Entrez votre adresse e-mail" 
          />
          <label>Email</label>
        </div>
        <button onClick$={handleSubmit}>Reinitialisation de votre mot de passe</button>
        
        <div class="info-text">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </div>
      </div>

      {form.success && <div class="message success">{form.success}</div>}
      {form.error && <div class="message error">{form.error}</div>}

      <div class="back-link">
        <Link href="/login">Return to login</Link>
      </div>
    </div>
  );
});

export default ForgotPassword;