import { component$ } from "@builder.io/qwik";
import './hero.css';

const Hero = component$(() => {
    return (
        <>
            <section class="hero">
        <div class="hero-content">
            <h1>Partagez et découvrez des <span>citations inspirantes</span> chaque jour</h1>
            <p>QwikQuotes est une plateforme collaborative qui permet à chacun de partager ses citations préférées, blagues et pensées inspirantes avec une communauté passionnée.</p>
            <div class="cta-buttons">
                <button class="btn btn-primary">Commencer gratuitement</button>
                <button class="btn btn-outline">En savoir plus</button>
            </div>
        </div>
        <div class="hero-image">
            <svg class="quote-illustration" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="400" height="300" rx="20" fill="rgba(255, 255, 255, 0.7)" stroke="#FF6B00" stroke-width="2" />
                <rect x="80" y="90" width="340" height="50" rx="10" fill="#FFF0E6" />
                <rect x="80" y="160" width="340" height="50" rx="10" fill="#FFF0E6" />
                <rect x="80" y="230" width="340" height="50" rx="10" fill="#FFF0E6" />
                <circle cx="120" cy="310" r="25" fill="#FF6B00" opacity="0.2" />
                <path d="M110 310 L120 320 L130 300" stroke="#FF6B00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M110 265 Q140 240 170 265" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M110 195 Q140 170 170 195" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M110 125 Q140 100 170 125" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
                <circle cx="350" cy="310" r="20" fill="#FF6B00" opacity="0.2" />
                <path d="M340 310 L350 320 L360 300" stroke="#FF6B00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M335 265 Q365 240 395 265" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M335 195 Q365 170 395 195" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
                <path d="M335 125 Q365 100 395 125" stroke="#FF8A33" stroke-width="3" fill="none" stroke-linecap="round" />
            </svg>
        </div>
    </section>

        </>
    )

});

export default Hero;