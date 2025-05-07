import { component$ } from "@builder.io/qwik";
import './navbar.css';
import { Link } from "@builder.io/qwik-city";

const Navbar  = component$(() => {

    return(
        <> 
            <nav class="navbar">
                <div class="logo">
                    <div class="logo-icon">📝</div>
                    <span>QwikQuotes</span>
                </div>
                <div class="nav-links">
                    <Link href="#" class="nav-link">Accueil</Link>
                    <Link href="#" class="nav-link">Découvrir</Link>
                    <Link href="#" class="nav-link">Tendances</Link>
                    <Link href="#" class="nav-link">À propos</Link>
                </div>
                <div class="auth-buttons">
                    <Link href="/login" class="btn btn-outline">Se connecter</Link>
                    <Link href="/register" class="btn btn-primary">S'inscrire</Link>
                </div>
                <button class="mobile-menu-btn">☰</button>
            </nav>
        </>
    )
})

export default Navbar;