import { component$ } from "@builder.io/qwik";

const Popularquotes = component$(() => {
    return (
    <>
        <section class="popular-quotes">
            <div class="section-title">
                <h2>Citations populaires</h2>
                <p>Découvrez les citations les plus appréciées par notre communauté</p>
            </div>
            <div class="quotes-grid">
                <div class="quote-card">
                    <div class="quote-content">
                        La vie est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre.
                    </div>
                    <div class="quote-author">
                        <div class="author-avatar">AE</div>
                        <div class="author-info">
                            <h4>Albert Einstein</h4>
                            <p>Partagé par Sophie L.</p>
                        </div>
                    </div>
                    <div class="quote-actions">
                        <button class="like-button">
                            <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            128
                        </button>
                    </div>
                </div>
                <div class="quote-card">
                    <div class="quote-content">
                        La seule façon de faire du bon travail est d'aimer ce que vous faites.
                    </div>
                    <div class="quote-author">
                        <div class="author-avatar">SJ</div>
                        <div class="author-info">
                            <h4>Steve Jobs</h4>
                            <p>Partagé par Marc D.</p>
                        </div>
                    </div>
                    <div class="quote-actions">
                        <button class="like-button">
                            <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            97
                        </button>
                    </div>
                </div>
                <div class="quote-card">
                    <div class="quote-content">
                        L'humour est une façon discrète d'avouer qu'on est intelligent.
                    </div>
                    <div class="quote-author">
                        <div class="author-avatar">FP</div>
                        <div class="author-info">
                            <h4>Frédéric Dard</h4>
                            <p>Partagé par Julie B.</p>
                        </div>
                    </div>
                    <div class="quote-actions">
                        <button class="like-button">
                            <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            85
                        </button>
                    </div>
                </div>
            </div>
        </section>

    </>
)

});

export default Popularquotes;