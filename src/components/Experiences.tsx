import { motion } from "motion/react";

const experiences = [
  {
    sector: "Services numériques · Direction et transformation",
    organization: "Groupe Luminess",
    description:
      "DSI de transition : direction de 60 collaborateurs, trajectoire de transformation reconstruite avec la direction générale, gouvernance opérationnelle renforcée et feuille de route cybersécurité conduite avec le RSSI."
  },
  {
    sector: "Sport et événementiel · Paris 2024",
    organization: "Une feuille de route technologique au service des opérations",
    description:
      "La feuille de route a été construite à partir des besoins des directions Revenu, Digital, Opérations, DAF et RH. Elle a soutenu la préparation et la continuité des opérations des Jeux.",
    proof:
      "300 besoins · 45 directions métiers · plus de 200 systèmes · opérations 24/7 sur plus de 200 sites · aucun incident majeur pendant les compétitions"
  },
  {
    sector: "Spectacle vivant · Exploitation événementielle",
    organization: "Accor Arena et Paris La Défense Arena",
    description:
      "Une connaissance concrète des systèmes au cœur de l’activité : billetterie, CRM, contrôle d’accès, services web et mobiles, paiements et support."
  },
  {
    sector: "Banque · Distribution · Télécommunications",
    organization: "DXC Technology (ex CSC)",
    description:
      "Pilotage de projets et programmes SI dans des environnements exigeants : refonte, monétique, schémas directeurs, rationalisation applicative et continuité de service."
  },
  {
    sector: "Culture · Métiers techniques de scène",
    organization: "Audit de l’Opéra de Paris",
    description:
      "Un audit SI au contact de métiers techniques de scène, dont le quotidien mobilise peu le numérique. Cette expérience éclaire l’importance de partir des contraintes de terrain pour faire évoluer les usages."
  }
];

export default function Experiences() {
  return (
    <section id="experiences" className="py-24 px-6 bg-paper">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">
            Expériences transposables
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            Des secteurs différents, des enjeux SI communs
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Services numériques, sport, événementiel, spectacle vivant, banque,
            distribution et télécommunications : comprendre les métiers, fixer
            les priorités, mobiliser les équipes et sécuriser les opérations
            sont des responsabilités qui se transfèrent d’un contexte à l’autre.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.organization}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
              className="border-t-2 border-accent pt-5"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                {experience.sector}
              </p>
              <h4 className="text-xl font-serif font-bold text-primary mb-3">
                {experience.organization}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {experience.description}
              </p>
              {experience.proof && (
                <p className="mt-4 text-sm font-semibold leading-relaxed text-primary">
                  {experience.proof}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
