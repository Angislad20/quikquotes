import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
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
        countdown: 60, // Secondes avant de pouvoir renvoyer un code
        canResend: false
    });

    const navigate = useNavigate();

    // Démarrer le compte à rebours
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

    const handleInputChange = (e: Event, index: number) => {
        const input = e.target as HTMLInputElement;
        const value = input.value;
        
        // Accepter uniquement les chiffres
        if (/^[0-9]*$/.test(value)) {
            if (value.length <= 1) {
                store.otp[index] = value;
                store.activeIndex = index;
                
                // Passer au champ suivant si un chiffre est entré
                if (value.length === 1 && index < 5) {
                    store.activeIndex = index + 1;
                    const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                }
            }
        } else {
            // Effacer la valeur si ce n'est pas un chiffre
            input.value = '';
        }
    };
    
    const handleKeyDown = (e: KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !store.otp[index] && index > 0) {
            store.activeIndex = index - 1;
            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
                // Optionnellement, effacer le champ précédent
                // store.otp[index - 1] = '';
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            store.activeIndex = index - 1;
            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
            if (prevInput) prevInput.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            store.activeIndex = index + 1;
            const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };
    
    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData?.getData('text').trim();
        
        if (pastedData && /^[0-9]{6}$/.test(pastedData)) {
            // Remplir tous les champs d'entrée avec les données collées
            for (let i = 0; i < 6; i++) {
                store.otp[i] = pastedData[i];
            }
            store.activeIndex = 5; // Mettre le focus sur le dernier champ
            const lastInput = document.querySelector(`input[data-index="5"]`) as HTMLInputElement;
            if (lastInput) lastInput.focus();
        }
    };
    
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const otp = store.otp.join('');
        if (otp.length !== 6) {
            store.errorMessage = "Veuillez entrer un code OTP complet.";
            return;
        }
        
        store.isLoading = true;
        store.errorMessage = '';
        
        try {
            // API pour vérifier l'OTP
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Si l'OTP est valide, on redirige vers la page de réinitialisation du mot de passe
                navigate('/reset-password');
            } else {
                store.errorMessage = data.message || 'Code OTP invalide. Veuillez réessayer.';
            }
        } catch (err) {
            console.error('Erreur:', err);
            store.errorMessage = 'Une erreur est survenue lors de la vérification du code.';
        } finally {
            store.isLoading = false;
        }
    };
    
    const resendOtp = async () => {
        if (!store.canResend) return;
        
        store.isLoading = true;
        store.errorMessage = '';
        
        try {
            // API pour renvoyer un nouvel OTP
            const response = await fetch('/api/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Réinitialiser les champs OTP
                store.otp = Array(6).fill('');
                store.activeIndex = 0;
                
                // Réinitialiser le compteur
                store.countdown = 60;
                store.canResend = false;
                
                // Mettre le focus sur le premier champ
                const firstInput = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
                if (firstInput) firstInput.focus();
            } else {
                store.errorMessage = data.message || 'Impossible de renvoyer le code OTP.';
            }
        } catch (err) {
            console.error('Erreur:', err);
            store.errorMessage = 'Une erreur est survenue lors de l\'envoi d\'un nouveau code.';
        } finally {
            store.isLoading = false;
        }
    };
    
    // Formater le temps restant
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    
    return (
        <div class="otp-container">
            <h2>Entrez le code OTP</h2>
            
            <form onSubmit$={handleSubmit} class="otp-form">
                <div class="input-group">
                    <p>Entrez le code de vérification à 6 chiffres envoyé à votre adresse email</p>
                    <div class="otp-inputs">
                        {store.otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                data-index={index}
                                value={digit}
                                onInput$={(e) => handleInputChange(e, index)}
                                onKeyDown$={(e) => handleKeyDown(e, index)}
                                onPaste$={handlePaste}
                                maxLength={1}
                                required
                                class={`otp-input ${store.activeIndex === index ? 'active-input' : ''}`}
                                aria-label={`Chiffre ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
                
                {store.errorMessage && (
                    <div class="message error">{store.errorMessage}</div>
                )}
                
                <button type="submit" disabled={store.isLoading}>
                    {store.isLoading ? 'Vérification...' : 'Vérifier le code'}
                </button>
                
                <div class="resend-code">
                    <button 
                        onClick$={resendOtp}
                        type="button"
                        disabled={!store.canResend || store.isLoading}
                    >
                        Renvoyer un nouveau code
                    </button>
                    {!store.canResend && (
                        <div class="timer">
                            Renvoyer un code dans {formatTime(store.countdown)}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
});

export default OtpComponent;