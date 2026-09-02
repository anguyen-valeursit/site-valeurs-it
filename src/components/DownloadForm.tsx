import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { SITE_CONTENT } from "../constants";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function DownloadForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: ""
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const path = 'downloads';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="temoignage" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary rounded-[40px] p-8 md:p-20 text-white relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 -skew-x-12 transform translate-x-1/4 -z-0" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Contenu Exclusif</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                Livre Blanc : Une aventure humaine et technique.
              </h3>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Découvrez les coulisses de mon expérience lors des Jeux, entre défis technologiques et moments d'exception. Un récit inspirant sur l'engagement et la performance.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-primary"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-bold">+500</span> téléchargements ce mois-ci
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 md:p-10 text-primary shadow-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h4 className="text-2xl font-serif font-bold mb-6">Recevoir le témoignage</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nom Complet</label>
                        <input
                          required
                          type="text"
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-3 bg-paper rounded-xl border border-gray-100 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Professionnel</label>
                        <input
                          required
                          type="email"
                          placeholder="jean@entreprise.com"
                          className="w-full px-4 py-3 bg-paper rounded-xl border border-gray-100 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Société</label>
                        <input
                          required
                          type="text"
                          placeholder="Valeurs IT"
                          className="w-full px-4 py-3 bg-paper rounded-xl border border-gray-100 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Accéder au téléchargement
                            <Download className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>
                    <p className="text-[10px] text-gray-400 mt-6 text-center">
                      En soumettant ce formulaire, vous acceptez notre politique de gestion des données.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-3xl font-serif font-bold mb-4">Merci, {formData.name.split(' ')[0]} !</h4>
                    <p className="text-gray-600 mb-10 leading-relaxed">
                      Le témoignage est maintenant disponible. Cliquez sur le bouton ci-dessous pour le consulter.
                    </p>
                    <a
                      href={SITE_CONTENT.links.testimony}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                    >
                      Consulter le document
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
