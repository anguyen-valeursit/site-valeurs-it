import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE_CONTENT } from "../constants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 transform translate-x-1/4 -z-10" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            Conseil stratégique · Direction SI de transition
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.98] mb-8 tracking-tighter">
            La technologie au service de la performance de votre organisation
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Stratégie SI, transformation numérique et cybersécurité : une direction expérimentée, proche des métiers et de leurs enjeux opérationnels.
          </p>

          <div className="flex flex-wrap gap-2 mb-10 max-w-xl" aria-label="Domaines d'intervention">
            {["DSI de transition", "Stratégie & gouvernance SI", "Transformation numérique", "Cybersécurité", "Continuité d'activité"].map((term) => (
              <span key={term} className="px-3 py-1.5 border border-primary/10 rounded-full text-xs md:text-sm text-gray-600 bg-white/70">{term}</span>
            ))}
          </div>

          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Secteurs d’intervention</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              {SITE_CONTENT.company.sectors.map((sector) => <span key={sector}>{sector}</span>)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a
              href="#services"
              className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all flex items-center gap-2 group"
            >
              Découvrir nos services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={SITE_CONTENT.links.testimony}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-primary/20 rounded-full font-medium hover:bg-accent/5 transition-all"
            >
              Témoignage des Jeux
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative group">
            <img
              src="/hero-valeurs-it.jpg"
              alt="Valeurs IT"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}

