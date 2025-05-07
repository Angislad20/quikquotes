import { component$, useStore, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import './register.css';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

const Register = component$(() => {
  const form = useStore<RegisterForm>({
    username: '',
    email: '',
    password: '',
  });

  const msg = useStore({ success: '', error: '' });

  const handleSubmit = $(async () => {
    msg.success = '';
    msg.error = '';

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        msg.error = data.message || 'Something went wrong';
      } else {
        msg.success = data.message;
      }
    } catch (err) {
      msg.error = 'Network error. Check your backend for more details.';
    }
  });

  return (
    <div class="register-container">
      <h2>S'inscrire</h2>
      <form preventdefault:submit onSubmit$={handleSubmit}>
        <div class="input-group">
          <input
            type="text"
            placeholder="nom d'utilisateur"
            value={form.username}
            onInput$={(e) => form.username = (e.target as HTMLInputElement).value}
          />
          <label>nom d'utilisateur</label>
        </div>
        <div class="input-group">
          <input
            type="email"
            placeholder="adresse email"
            value={form.email}
            onInput$={(e) => form.email = (e.target as HTMLInputElement).value}
          />
          <label>Adresse email</label>
        </div>
        <div class="input-group">
          <input
            type="password"
            placeholder="mot de passe"
            value={form.password}
            onInput$={(e) => form.password = (e.target as HTMLInputElement).value}
          />
          <label>Mot de passe</label>
        </div>
        <button type="submit">Inscrivez-vous</button>
        <div class="info-text">
          En vous inscrivant, vous acceptez nos <Link href="/terms">conditions d'utilisation</Link> et notre <Link href="/privacy">politique de confidentialité</Link>.
        </div>
      </form>

      {msg.success && <div class="message success">{msg.success}</div>}
      {msg.error && <div class="message error">{msg.error}</div>}

      <div class="bottom-links">
        <p>Déjà inscrit ? <Link href="/login">Connectez-vous</Link></p>
      </div>
    </div>
  );
});

export default Register;
