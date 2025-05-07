import { component$ } from "@builder.io/qwik";
import './cta.css';

const Cta = component$(() => {
    return(
    <>
        <section class="cta-section">
            <div class="cta-container">
                <h2>Prêt à partager vos citations préférées ?</h2>
                <p>Rejoignez notre communauté de passionnés et commencez à partager vos propres citations dès aujourd'hui.</p>
                <button class="btn btn-primary">Créer un compte gratuitement</button>
            </div>
        </section>
    </>
    )

});

export default Cta;