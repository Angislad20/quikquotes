import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Cta from "~/components/Home/cta/cta";
import Feature from "~/components/Home/features/feature";
import Footer from "~/components/Home/footer/footer";
import Hero from "~/components/Home/hero/hero";
import Navbar from "~/components/Home/navbar/navbar";
import Popularquotes from "~/components/Home/popularquotes/popularquotes";


export default component$(() => {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <Popularquotes />
      <Cta />
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: "Bading CI",
  meta: [
    {
      name: "CI-ref",
      content: "Ici, tu pourras trouver tous les badings ivoiriens que tu veux. Tu pourras aussi partager tes propres badings",
    },
  ],
};
