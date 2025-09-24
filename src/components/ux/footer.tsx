// src/components/ui/footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
       
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/logo_crhom.jpg"
            alt="Logo"
            className="w-20 h-20 mb-4 rounded shadow-md"
          />
          <p className="text-sm leading-6 text-center md:text-left">
            Club de Mölkky Lyon – Convivialité, partage et bonne humeur.
            Venez découvrir et participer à nos événements !
          </p>
        </div>

       
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 text-gold">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-gold transition">Accueil</a></li>
            <li><a href="/about" className="hover:text-gold transition">À propos</a></li>
            <li><a href="/evenements" className="hover:text-gold transition">Évènements</a></li>
            <li><a href="/contact" className="hover:text-gold transition">Contact</a></li>
            <li><a href="/mentions-legales" className="hover:text-gold transition">Mentions légales</a></li>
          </ul>
        </div>

    
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4 text-gold">Nous suivre</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/CRHOM69/" target="_blank" rel="noopener noreferrer">
              <img
                src="/facebook.png"
                alt="Facebook"
                className="w-6 h-6 hover:opacity-75 transition"
              />
            </a>
          </div>
        </div>
      </div>


      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2025 CRAZY DEV – Tous droits réservés.
      </div>
    </footer>
  );
}
