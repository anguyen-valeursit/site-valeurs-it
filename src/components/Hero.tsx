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
            Expertise IT & Conseil
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] mb-8 tracking-tighter">
            {SITE_CONTENT.company.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            {SITE_CONTENT.company.tagline}
          </p>
          
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
              src="https://picsum.photos/seed/tech/800/1000"
              alt="Valeurs IT"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Floating Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[240px]"
          >
            <div className="text-accent font-serif text-4xl font-bold mb-1">20+</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Années d'expertise cumulée</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
