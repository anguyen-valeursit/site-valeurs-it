import { useEffect } from "react";
import { motion } from "motion/react";
import { Linkedin, Quote } from "lucide-react";
import { SITE_CONTENT } from "../constants";

export default function Bio() {
  useEffect(() => {
    // Load LinkedIn script dynamically if not already present
    const scriptId = "linkedin-profile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://platform.linkedin.com/badges/js/profile.js";
      script.async = true;
      script.defer = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    } else {
      // If script already exists, we might need to re-initialize the badge
      // The LinkedIn script usually handles this if it's already loaded, 
      // but sometimes it needs a trigger.
      if ((window as any).LIRC) {
        (window as any).LIRC.reload();
      }
    }
  }, []);

  return (
    <section id="bio" className="py-24 px-6 bg-paper relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute top-0 left-0 text-[20vw] font-serif font-bold opacity-[0.02] select-none pointer-events-none -translate-y-1/4">
        VISION
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="relative mb-10">
            <Quote className="w-12 h-12 text-accent opacity-20 absolute -top-6 -left-6" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Le Fondateur</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              {SITE_CONTENT.bio.name}
            </h3>
            <p className="text-xl font-serif italic text-gray-500 mb-8">
              "{SITE_CONTENT.bio.title}"
            </p>
          </div>
          
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
            <p>{SITE_CONTENT.bio.description}</p>
          </div>

          <div className="mb-10 min-h-[250px] flex items-start">
            <div 
              className="badge-base LI-profile-badge" 
              data-locale="fr_FR" 
              data-size="medium" 
              data-theme="dark" 
              data-type="VERTICAL" 
              data-vanity="vnguye27" 
              data-version="v1"
            >
              <a 
                className="badge-base__link LI-simple-link" 
                href="https://fr.linkedin.com/in/vnguye27?trk=profile-badge"
              >
                
              </a>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 lg:order-2 relative"
        >
          <div className="aspect-[3/4] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img
              src="https://picsum.photos/seed/bio/800/1000"
              alt={SITE_CONTENT.bio.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Decorative frame */}
          <div className="absolute -top-6 -right-6 w-full h-full border-2 border-accent/20 rounded-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
