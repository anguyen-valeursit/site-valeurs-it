import { motion } from "motion/react";
import { Lightbulb, Zap, ShieldCheck, Users } from "lucide-react";
import { SITE_CONTENT } from "../constants";

const iconMap = {
  Lightbulb,
  Zap,
  ShieldCheck,
  Users
};

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Nos Services</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8">
            Une expertise complète pour votre transformation.
          </h3>
          <p className="text-lg text-gray-600">
            Nous proposons une gamme de services adaptés aux besoins spécifiques de chaque entreprise, de la stratégie à la mise en œuvre technique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SITE_CONTENT.services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-paper rounded-3xl hover:bg-accent/5 transition-colors group border border-transparent hover:border-accent/10"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h4 className="text-xl font-serif font-bold mb-4">{service.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
