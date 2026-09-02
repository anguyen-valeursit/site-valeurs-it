import { SITE_CONTENT } from "../constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-4">{SITE_CONTENT.company.name}</h2>
            <p className="text-gray-400 max-w-md">
              {SITE_CONTENT.company.tagline}
            </p>
          </div>
          
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-6 opacity-50">Navigation</h3>
            <ul className="space-y-4">
              <li><a href="#histoire" className="hover:text-accent transition-colors">Histoire</a></li>
              <li><a href="#bio" className="hover:text-accent transition-colors">Bio</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
              <li><a href="#actualites" className="hover:text-accent transition-colors">Actualités</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-widest mb-6 opacity-50">Légal</h3>
            <ul className="space-y-4">
              <li><a href="/mentions-legales" className="hover:text-accent transition-colors">Mentions Légales</a></li>
              <li><a href="/politique-confidentialite" className="hover:text-accent transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} {SITE_CONTENT.company.name}. Tous droits réservés.</p>
          <p>Design par Agence Nomade</p>
        </div>
      </div>
    </footer>
  );
}
