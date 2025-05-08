import { useStore } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { component$ } from '@builder.io/qwik';
import './reset-password.css';

interface ResetPassword {
    newPassword: string;
    confirmPassword: string;
    isLoading: boolean;
    errorMessage: string;
    successMessage: string;
    }
export default component$(() => {
  const store = useStore<ResetPassword>({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    errorMessage: '',
    successMessage: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Validation des mots de passe
    if (store.newPassword !== store.confirmPassword) {
      store.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (store.newPassword.length < 8) {
      store.errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    }

    store.isLoading = true;
    store.errorMessage = '';

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: store.newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        store.successMessage = 'Mot de passe réinitialisé avec succès';
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        store.errorMessage = data.message || 'Erreur lors de la réinitialisation du mot de passe';
      }
    } catch (err) {
      console.error('Erreur:', err);
      store.errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
    } finally {
      store.isLoading = false;
    }
  };

  return (
    <div class="reset-password-container">
      <h2>Réinitialiser votre mot de passe</h2>
      
      <form onSubmit$={handleSubmit} class="reset-password-form">
        <div class="input-group">
          <input
            type="password"
            id="new-password"
            value={store.newPassword}
            onInput$={(e) => (store.newPassword = (e.target as HTMLInputElement).value)}
            required
            placeholder="Nouveau mot de passe"
          />
        </div>
        
        <div class="input-group">
          <input
            type="password"
            id="confirm-password"
            value={store.confirmPassword}
            onInput$={(e) => (store.confirmPassword = (e.target as HTMLInputElement).value)}
            required
            placeholder="Confirmer le mot de passe"
          />
        </div>

        {store.errorMessage && <div class="message error">{store.errorMessage}</div>}
        {store.successMessage && <div class="message success">{store.successMessage}</div>}

        <button type="submit" disabled={store.isLoading}>
          {store.isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </div>
  );
});
