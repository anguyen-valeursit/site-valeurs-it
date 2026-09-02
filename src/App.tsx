import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import History from "./components/History";
import Bio from "./components/Bio";
import Services from "./components/Services";
import News from "./components/News";
import DownloadForm from "./components/DownloadForm";
import ContactForm from "./components/ContactForm";
import AdminDashboard from "./components/AdminDashboard";
import ArticleView from "./components/ArticleView";
import Footer from "./components/Footer";
import LegalModal from "./components/LegalModal";
import ErrorBoundary from "./components/ErrorBoundary";

function CVViewer() {
  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-primary text-white">
        <h1 className="font-serif text-xl font-bold">CV - Alain Nguyen</h1>
        <a 
          href="/" 
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
        >
          Retour au site
        </a>
      </div>
      <iframe 
        src="https://drive.google.com/file/d/1WmWbbaGYDoO8x7iq-S-sh7XaWXhgtCXm/preview" 
        className="flex-grow w-full border-none"
        title="CV Alain Nguyen"
        allow="autoplay"
      />
    </div>
  );
}

export default function App() {
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
    isOpen: false,
    title: "",
    content: null
  });

  // Google Analytics Initialization
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", anchor.hash);
        }
      } else if (anchor && (anchor.getAttribute("href") === "/mentions-legales" || anchor.getAttribute("href") === "/politique-confidentialite")) {
        e.preventDefault();
        const type = anchor.getAttribute("href");
        if (type === "/mentions-legales") {
          setLegalModal({
            isOpen: true,
            title: "Mentions Légales",
            content: (
              <div className="space-y-6">
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">1. Éditeur du site</h4>
                  <p>
                    Raison sociale : VALEURS IT<br />
                    Siège social : 1 RUE DE STOCKHOLM, 75008 PARIS<br />
                    E-mail : contact@valeurs-it.com
                  </p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">2. Statut juridique</h4>
                  <p>
                    Forme juridique : SAS (Société par actions simplifiée)<br />
                    SIREN : 940 094 527<br />
                    Ville du RCS : Paris
                  </p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">3. Direction de la publication</h4>
                  <p>Directeur de la publication : Viêt-Hung Nguyen</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">4. Hébergement</h4>
                  <p>
                    Le site est hébergé par Google Cloud Platform.<br />
                    Google France, 8 Rue de Londres, 75009 Paris.
                  </p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">5. Propriété intellectuelle</h4>
                  <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
                  </p>
                </section>
              </div>
            )
          });
        } else {
          setLegalModal({
            isOpen: true,
            title: "Politique de Confidentialité (RGPD)",
            content: (
              <div className="space-y-6">
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">1. Responsable du traitement</h4>
                  <p>Le responsable du traitement des données est Viêt-Hung Nguyen.</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">2. Finalité de la collecte</h4>
                  <p>Les données collectées via le formulaire de contact sont utilisées exclusivement pour la gestion de vos demandes et la relation commerciale qui peut en découler.</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">3. Données collectées</h4>
                  <p>Nous collectons les données suivantes : Nom, E-mail, Message.</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">4. Base légale</h4>
                  <p>Le traitement de vos données est basé sur votre consentement explicite lors de l'envoi du formulaire.</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">5. Durée de conservation</h4>
                  <p>Les données sont conservées pour une durée maximale de 3 ans après le dernier contact de votre part.</p>
                </section>
                <section>
                  <h4 className="text-lg font-bold text-primary mb-2">6. Vos droits</h4>
                  <p>
                    Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant par e-mail.<br /><br />
                    Pour plus d'informations, vous pouvez consulter le site de la CNIL (cnil.fr).
                  </p>
                </section>
              </div>
            )
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/cv" element={<CVViewer />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/actualites/:id" element={<ArticleView />} />
        <Route path="*" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-grow">
              <Hero />
              <History />
              <Bio />
              <Services />
              <News />
              <DownloadForm />
              <ContactForm />
            </main>
            
            <Footer />
            
            <LegalModal
              isOpen={legalModal.isOpen}
              onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
              title={legalModal.title}
              content={legalModal.content}
            />
            
            {/* Scroll to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 hover:bg-accent hover:text-white transition-all z-40 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 group-hover:-translate-y-1 transition-transform"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  );
}
