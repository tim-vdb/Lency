import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <section className="p-8 lg:px-24">
      <h1 className="mb-8 text-center">Contactez-nous</h1>

      <div className="grid md:grid-cols-2 gap-12 rounded-xl p-8 shadow-md">
        {/* === FORMULAIRE FORMSPREE === */}
        <form
          id="contact-form"
          action="https://formspree.io/f/mgvezdao"
          method="POST"
          className="bg-white p-6 rounded-xl shadow-md dark:shadow-black/40 flex flex-col gap-4"
        >
          <input type="hidden" name="contact_number" value="697483" />

          <label className="flex flex-col text-sm md:text-base text-black">
            Nom
            <input
              type="text"
              name="name"
              required
              placeholder="Votre nom"
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold text-black"
            />
          </label>

          <label className="flex flex-col text-sm md:text-base text-black">
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="Votre email"
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold text-black"
            />
          </label>

          <label className="flex flex-col text-sm md:text-base">
            Message
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Votre message"
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold text-black"
            ></textarea>
          </label>

          <button
            type="submit"
            className="mt-4 bg-gold text-gray-900 dark:text-white text-sm font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Envoyer
          </button>

          <div id="status"></div>
        </form>

        {/* === INFOS DE CONTACT === */}
        <div className="flex flex-col md:gap-6 dark:bg-card rounded-xl p-8">
          <h2 className="font-bold">Nous contacter</h2>
          <div>
            <h3 className="md:mb-2">Adresse</h3>
            <p>3 Rue Turbil, 69003 Lyon, France</p>
          </div>

          <div>
            <h3 className="md:mb-2">Téléphone</h3>
            <p>+33 6 12 34 56 78</p>
          </div>

          <div>
            <h3 className="md:mb-2">Horaires</h3>
            <p>Lundi - Vendredi : 10h - 18h</p>
          </div>
        </div>
      </div>

      {/* === SECTION IMAGE + TEXTE === */}
      <div className="mt-16 flex flex-col md:flex-row items-center gap-8 p-8 rounded-xl shadow-md">
        <div className="md:w-1/2 shadow-md">
          <Image
            width={500}
            height={500}
            src="/images/molkky_contact.jpeg"
            alt="Molkky"
            className="rounded-xl shadow-md w-full object-cover"
          />
        </div>
        <div className="md:w-1/2 dark:bg-card rounded-xl p-8">
          <h1 className="mb-4">Notre mission</h1>
          <p className="text-sm">
            Chez MOLKKY, nous nous efforçons de promouvoir la convivialité et le
            sport à travers le Mölkky. Rejoignez-nous pour partager des moments
            uniques avec notre communauté !
          </p>
          <button
            type="button"
            className="mt-4 bg-gold text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            <Link href="/sign-up">S'inscrire</Link>
          </button>
        </div>
      </div>

      {/* === GOOGLE MAP === */}
      <div className="mt-16 flex flex-col md:flex-row gap-8 p-8 rounded-xl shadow-md">
        <div className="md:w-1/2 h-64 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2781.123456!2d4.8357!3d45.7566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDQ1JzQ1LjgiTiA0wrA1MCc0MC42IkU!5e0!3m2!1sfr!2sfr!4v1695480000000!5m2!1sfr!2sfr"
            className="border-0 w-full h-full rounded-xl"
            allowFullScreen
          ></iframe>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center gap-4 dark:bg-card rounded-xl p-8">
          <h2 className="font-bold">Venez nous rencontrer !</h2>
          <p className="text-sm">
            Retrouvez-nous au parc de Lyon pour découvrir le Mölkky en vrai !
            Consultez nos événements et inscrivez-vous directement en ligne.
          </p>
          <button
            type="button"
            className="mt-2 bg-gold text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition w-fit"
          >
            <Link href="/events">Voir les événements</Link>
          </button>
        </div>
      </div>
    </section>
  );
}
