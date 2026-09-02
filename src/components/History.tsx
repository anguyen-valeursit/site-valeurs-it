import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SITE_CONTENT } from "../constants";

export default function History() {
  return (
    <section id="histoire" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/histoire-valeurs-it.jpg"
              alt="Histoire de Valeurs IT"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Notre Histoire</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
            {SITE_CONTENT.company.tagline}
          </h3>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p className="font-medium text-gray-900">{SITE_CONTENT.company.history}</p>
            
            <div className="py-2 space-y-4">
              <p className="font-bold text-primary">Nous intervenons aux côtés des directions générales et des DSI pour :</p>
              <ul className="space-y-4">
                {SITE_CONTENT.company.interventionPoints?.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="italic border-l-4 border-accent pl-6 py-2 bg-accent/5 rounded-r-lg">
              {SITE_CONTENT.company.mission}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
