import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Cta from "~/components/Home/cta/cta";
import Feature from "~/components/Home/features/feature";
import Footer from "~/components/Home/footer/footer";
import Hero from "~/components/Home/hero/hero";
import Navbar from "~/components/Home/navbar/navbar";


export default component$(() => {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <Cta />
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
