import { component$, useStore, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import './login.css';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = component$(() => {
  const form = useStore<LoginForm>({ 
    email: '', 
    password: '', 
    rememberMe: false,
  });

  const msg = useStore({ success: '', error: '' });

  const handleLogin = $(async () => {
    msg.success = '';
    msg.error = '';
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: form.email, 
          password: form.password,
          rememberMe: form.rememberMe
        })
      });
      const data = await res.json();
      res.ok ? msg.success = data.message : msg.error = data.message;
    } catch {
      msg.error = 'Erreur réseau ou serveur inaccessible.';
    }
  });

  return (
    <div class="login-container">
      <h2>Connexion</h2>
      <form preventdefault:submit onSubmit$={handleLogin}>
        <div class="input-group">
          <input
            type="email"
            placeholder="Adress email"
            value={form.email}
            onInput$={(e) => form.email = (e.target as HTMLInputElement).value}
          />
          <label>Email</label>
        </div>
        <div class="input-group">
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onInput$={(e) => form.password = (e.target as HTMLInputElement).value}
          />
          <label>Mot de passe</label>
        </div>
        
        <div class="remember-me">
          <input 
            type="checkbox" 
            id="remember-me" 
            checked={form.rememberMe}
            onChange$={(e) => form.rememberMe = (e.target as HTMLInputElement).checked}
          />
          <label for="remember-me">Se souvenir de moi</label>
        </div>
        <button type="submit">Se connecter</button>
      </form>
      
      {msg.success && <div class="message success">{msg.success}</div>}
      {msg.error && <div class="message error">{msg.error}</div>}

      <div class="bottom-links">
        <p>Pas encore inscrit ? <Link href="/register">Créer un compte</Link></p>
        <p><Link href="/forgot-password">Mot de passe oublié ?</Link></p>
      </div>
    </div>
  );
});

export default Login;