// src/components/ui/footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10">
      <div className="container mx-auto px-6 flex flex-wrap md:flex-nowrap justify-center md:justify-between md:max-w-5xl">
        
        {/* Bloc logo + description */}
        <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0">
          <div className="flex flex-col text-center md:text-left">
            <img
              src="/logo_crhom.jpg"
              alt="Logo"
              className="w-25 h-25 mb-4 rounded shadow-md mx-auto md:mx-0"
            />
            <p className="text-sm leading-6 max-w-xs">
              Club de Mölkky Lyon – Convivialité, partage et bonne humeur.
              Venez découvrir et participer à nos événements !
            </p>
          </div>
        </div>

        {/* Bloc liens rapides */}
        <div className="w-full md:w-1/3 flex justify-center mb-10 md:mb-0">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-gold">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-xs hover:text-gold transition">Accueil</a></li>
              <li><a href="/about" className="text-xs hover:text-gold transition">À propos</a></li>
              <li><a href="/evenements" className="text-xs hover:text-gold transition">Évènements</a></li>
              <li><a href="/contact" className="text-xs hover:text-gold transition">Contact</a></li>
              <li><a href="/mentions-legales" className="text-xs hover:text-gold transition">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        {/* Bloc réseaux sociaux */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-gold">Nous suivre</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/CRHOM69/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/facebook.png"
                  alt="Facebook"
                  className="w-8 h-8 hover:opacity-75 transition"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2025 CRAZY DEV – Tous droits réservés.
      </div>
    </footer>
  );
}
