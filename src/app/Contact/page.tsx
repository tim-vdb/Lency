import React from 'react';

export default function ContactPage() {
  return (
    <main className="p-8 sm:p-12 md:p-16 lg:px-24 lg:py-12">
      
     
      <h1 className="text-4xl md:text-5xl font-cooper font-bold mb-8 text-center md:text-left">
        Contactez-nous
      </h1>

      
      <div className="grid md:grid-cols-2 gap-12">
        <form className="bg-white p-6 rounded-xl shadow-md dark:shadow-black/40 flex flex-col gap-4">
          <label className="flex flex-col text-sm md:text-base">
            Nom
            <input
              type="text"
              placeholder="Votre nom"
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>

          <label className="flex flex-col text-sm md:text-base">
            Email
            <input
              type="email"
              placeholder="Votre email"
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>

          <label className="flex flex-col text-sm md:text-base">
            Message
            <textarea
              placeholder="Votre message"
              rows={5}
              className="mt-1 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-gold"
            ></textarea>
          </label>

          <button
            type="submit"
            className="mt-4 bg-gold text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Envoyer
          </button>
        </form>

        <div className="flex flex-col gap-6 text-sm md:text-base p-1">
          <div>
            <h2 className="text-2xl font-cooper font-semibold mb-2">Adresse</h2>
            <p>3 Rue Turbil, 69003 Lyon, France</p>
          </div>

          <div>
            <h2 className="text-2xl font-cooper font-semibold mb-2">Email</h2>
            <p>contact@MOLKKY.fr</p>
          </div>

          <div>
            <h2 className="text-2xl font-cooper font-semibold mb-2">Téléphone</h2>
            <p>+33 6 12 34 56 78</p>
          </div>

          <div>
            <h2 className="text-2xl font-cooper font-semibold mb-2">Horaires</h2>
            <p>Lundi - Vendredi : 10h - 18h</p>
          </div>
        </div>
      </div>

      
      <div className="mt-16 flex flex-col md:flex-row items-center gap-8 p-8 rounded-xl">
        <div className="md:w-1/2 shadow-md dark:shadow-black">
          <img
            src="/molkky_contact.jpeg"
            alt="Molkky"
            className="rounded-xl shadow-md w-full object-cover"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-cooper font-bold mb-4">Notre mission</h1>
          <p className="text-sm md:text-base">
            Chez MOLKKY, nous nous efforçons de promouvoir la convivialité et le sport à travers le Mölkky. Rejoignez-nous pour partager des moments uniques avec notre communauté !
          </p>
          <button
            type="button"
            className="mt-4 bg-gold text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            S'inscrire
          </button>
        </div>
      </div>

    
      <div className="mt-16 flex flex-col md:flex-row gap-8 p-8 rounded-xl shadow-md">
        <div className="md:w-1/2 h-64 md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2781.123456!2d4.8357!3d45.7566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDQ1JzQ1LjgiTiA0wrA1MCc0MC42IkU!5e0!3m2!1sfr!2sfr!4v1695480000000!5m2!1sfr!2sfr"
            className="border-0 w-full h-full"
            allowFullScreen
          ></iframe>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center gap-4">
          <h2 className="text-3xl font-cooper font-bold">Venez nous rencontrer !</h2>
          <p className="text-sm">
            Retrouvez-nous au parc de Lyon pour découvrir le Mölkky en vrai ! Consultez nos événements et inscrivez-vous directement en ligne.
          </p>
          <button
            type="button"
            className="mt-2 bg-gold text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition w-fit"
          >
            Voir les événements
          </button>
        </div>
      </div>

    </main>
  );
}
