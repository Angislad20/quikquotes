import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import './otp.css';

interface OtpUsing {
  otp: string[];
  isLoading: boolean;
  errorMessage: string;
  activeIndex: number;
  countdown: number;
  canResend: boolean;
}

const OtpComponent = component$(() => {
  const store = useStore<OtpUsing>({
    otp: Array(6).fill(''),
    isLoading: false,
    errorMessage: '',
    activeIndex: 0,
    countdown: 60,
    canResend: false
  });

  const navigate = useNavigate();

  useVisibleTask$(({ cleanup }) => {
    const timer = setInterval(() => {
      if (store.countdown > 0) {
        store.countdown--;
      } else {
        store.canResend = true;
        clearInterval(timer);
      }
    }, 1000);
    cleanup(() => clearInterval(timer));
  });

  const handleInputChange = $((e: Event, index: number) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    if (/^[0-9]$/.test(value)) {
      store.otp[index] = value;
      if (index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  });

  

  const handleKeyDown = $((e: KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !store.otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      prevInput?.focus();
    }
  });

  const handlePaste = $((e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(pasted)) {
      for (let i = 0; i < 6; i++) store.otp[i] = pasted[i];
      const last = document.querySelector(`input[data-index="5"]`) as HTMLInputElement;
      last?.focus();
    }
  });

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    const otp = store.otp.join('');
    if (otp.length !== 6) {
      store.errorMessage = 'Veuillez entrer un code complet.';
      return;
    }

    store.isLoading = true;
    store.errorMessage = '';

    try {
      const res = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/reset-password');
      } else {
        store.errorMessage = data.message || 'Code invalide.';
      }
    } catch {
      store.errorMessage = 'Erreur de communication avec le serveur.';
    } finally {
      store.isLoading = false;
    }
  });

  const resendOtp = $(async () => {
    if (!store.canResend) return;

    store.isLoading = true;
    store.errorMessage = '';

    try {
      const res = await fetch('http://localhost:3000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (res.ok) {
        store.otp = Array(6).fill('');
        store.activeIndex = 0;
        store.countdown = 60;
        store.canResend = false;
        const first = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
        first?.focus();
      } else {
        store.errorMessage = data.message || 'Échec du renvoi du code.';
      }
    } catch {
      store.errorMessage = 'Erreur lors du renvoi du code.';
    } finally {
      store.isLoading = false;
    }
  });

  return (
    <div class="otp-container">
      <h2>Entrez le code OTP</h2>
      <form onSubmit$={handleSubmit} class="otp-form">
        <p>Entrez le code envoyé par email</p>
        <div class="otp-inputs">
          {store.otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              data-index={index}
              value={digit}
              maxLength={1}
              class={`otp-input ${store.activeIndex === index ? 'active-input' : ''}`}
              onInput$={(e) => handleInputChange(e, index)}
              onKeyDown$={(e) => handleKeyDown(e, index)}
              onPaste$={handlePaste}
              aria-label={`Chiffre ${index + 1}`}
              required
            />
          ))}
        </div>

        {store.errorMessage && <div class="message error">{store.errorMessage}</div>}

        <button type="submit" disabled={store.isLoading}>
          {store.isLoading ? 'Vérification...' : 'Vérifier le code'}
        </button>

        <div class="resend-code">
          <button onClick$={resendOtp} type="button" disabled={!store.canResend || store.isLoading}>
            Renvoyer un code
          </button>
          {!store.canResend && (
            <div class="timer">Renvoyer un code dans {Math.floor(store.countdown / 60)}:{(store.countdown % 60).toString().padStart(2, '0')}</div>
          )}
        </div>
      </form>
    </div>
  );
});

export default OtpComponent;
