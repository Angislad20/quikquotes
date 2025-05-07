import { component$ } from "@builder.io/qwik";
import './feature.css';

const Feature = component$(() => {
    return(
        <>
            <section class="features">
            <div class="features-container">
                <div class="section-title">
                    <h2>Pourquoi choisir QwikQuotes ?</h2>
                    <p>Notre plateforme vous offre une expérience unique pour partager et découvrir des citations inspirantes</p>
                </div>
                <div class="feature-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📝</div>
                        <h3>Partagez facilement</h3>
                        <p>Ajoutez vos propres citations, blagues ou réflexions en quelques clics seulement.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔍</div>
                        <h3>Découvrez du contenu</h3>
                        <p>Explorez une vaste bibliothèque de citations soigneusement sélectionnées par notre communauté.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">❤️</div>
                        <h3>Interagissez</h3>
                        <p>Aimez et partagez vos citations préférées pour les faire découvrir à d'autres.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">👥</div>
                        <h3>Rejoignez la communauté</h3>
                        <p>Devenez membre d'une communauté passionnée qui partage votre amour pour les mots inspirants.</p>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
})

export default Feature;
