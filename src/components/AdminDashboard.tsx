import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Download, 
  Mail, 
  LogOut, 
  LogIn, 
  ShieldAlert, 
  Loader2, 
  Calendar,
  Building2,
  User,
  ArrowLeft,
  Globe,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { auth, db } from "../firebase";
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { Link } from "react-router-dom";

// Types
interface DownloadEntry {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: Timestamp;
}

interface ContactEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: Timestamp;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'downloads' | 'contacts'>('downloads');
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  const isAdmin = user?.email?.toLowerCase() === "anguyen@valeurs-it.com";

  useEffect(() => {
    // Process redirect sign in result if returning from Google login redirect
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error("Redirect auth error:", err);
        handleAuthError(err);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      setError(null);
      
      // Listen to downloads
      const qDownloads = query(collection(db, "downloads"), orderBy("createdAt", "desc"));
      const unsubDownloads = onSnapshot(qDownloads, 
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DownloadEntry));
          setDownloads(data);
        },
        (err) => {
          console.error("Error fetching downloads:", err);
          setError("Erreur lors de la récupération des téléchargements : " + err.message);
        }
      );

      // Listen to contacts
      const qContacts = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const unsubContacts = onSnapshot(qContacts, 
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactEntry));
          setContacts(data);
        },
        (err) => {
          console.error("Error fetching contacts:", err);
          setError("Erreur lors de la récupération des contacts : " + err.message);
        }
      );

      return () => {
        unsubDownloads();
        unsubContacts();
      };
    }
  }, [user, isAdmin]);

  const handleAuthError = (err: any) => {
    const code = err?.code || "";
    const message = err?.message || String(err);
    const currentHost = window.location.hostname;

    if (code === "auth/unauthorized-domain") {
      setUnauthorizedDomain(currentHost);
      setError(`Le domaine "${currentHost}" n'est pas autorisé dans la console Firebase.`);
    } else if (code === "auth/popup-blocked") {
      setError("La fenêtre pop-up a été bloquée par le navigateur. Utilisez la connexion par redirection ci-dessous.");
    } else if (code === "auth/popup-closed-by-user") {
      setError("La fenêtre de connexion a été fermée. Vous pouvez utiliser la connexion par redirection.");
    } else {
      setError(`Erreur de connexion (${code || 'Inconnue'}) : ${message}`);
    }
  };

  const handleLoginPopup = async () => {
    setError(null);
    setUnauthorizedDomain(null);
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login popup error:", err);
      handleAuthError(err);
      
      // Fallback to redirect if popup failed due to popup blocker or closure
      if (err?.code === "auth/popup-blocked" || err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        console.log("Popup blocked/closed. Trying signInWithRedirect...");
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          handleAuthError(redirectErr);
        }
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLoginRedirect = async () => {
    setError(null);
    setUnauthorizedDomain(null);
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error("Login redirect error:", err);
      handleAuthError(err);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setError(null);
    setUnauthorizedDomain(null);
    signOut(auth);
  };

  if (loading || isAuthenticating) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Chargement de la session d'administration...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-[32px] p-8 md:p-10 shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-3">Administration</h1>
          <p className="text-gray-500 mb-8">
            Veuillez vous connecter avec votre compte administrateur (<strong className="text-gray-700">anguyen@valeurs-it.com</strong>) pour consulter les téléchargements et contacts.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Information d'authentification</span>
              </div>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {unauthorizedDomain && (
            <div className="mb-6 p-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-2xl text-left space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <Globe className="w-4 h-4 shrink-0" />
                <span>Configuration du domaine requise sur Firebase</span>
              </div>
              <p className="leading-relaxed text-xs">
                Le nom de domaine <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900">{unauthorizedDomain}</code> doit être ajouté dans les domaines autorisés de Firebase Authentication.
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">Procédure rapide :</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Ouvrez la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Console Firebase</a></li>
                  <li>Accédez à <strong>Authentication</strong> &gt; Onglet <strong>Settings / Paramètres</strong></li>
                  <li>Sous <strong>Domaines autorisés</strong>, ajoutez <code className="bg-gray-100 px-1 rounded font-mono text-gray-800">valeurs-it.com</code> et <code className="bg-gray-100 px-1 rounded font-mono text-gray-800">www.valeurs-it.com</code></li>
                </ol>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Se connecter (Redirection)
            </button>

            <button
              onClick={handleLoginPopup}
              className="w-full py-3.5 border-2 border-gray-200 text-gray-700 hover:text-primary rounded-xl font-semibold text-sm hover:border-primary/40 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
              Se connecter via fenêtre Pop-up
            </button>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mt-8">
            <ArrowLeft className="w-4 h-4" />
            Retour au site principal
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4">Accès Refusé</h1>
          <p className="text-gray-500 mb-2">
            Vous êtes connecté en tant que <strong className="text-gray-700">{user.email}</strong>.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Seul le compte <strong>anguyen@valeurs-it.com</strong> est autorisé à consulter ces données.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-4 border-2 border-gray-100 text-primary rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-8 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold">Dashboard Admin</h1>
              <p className="text-xs text-white/60">Connecté en tant que {user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all">
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Quitter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${
              activeTab === 'downloads' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            <Download className="w-4 h-4" />
            Téléchargements ({downloads.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${
              activeTab === 'contacts' 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            Contacts ({contacts.length})
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'downloads' ? (
              <motion.div
                key="downloads"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {downloads.length === 0 ? (
                  <div className="bg-white rounded-3xl p-20 text-center text-gray-400">
                    Aucun téléchargement enregistré pour le moment.
                  </div>
                ) : (
                  downloads.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary/40" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{entry.name}</h3>
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {entry.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium text-gray-600">{entry.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date non disponible'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {contacts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-20 text-center text-gray-400">
                    Aucun message de contact reçu pour le moment.
                  </div>
                ) : (
                  contacts.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary/40" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{entry.firstName} {entry.lastName}</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-2">
                              <Mail className="w-3 h-3" /> {entry.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-paper px-4 py-2 rounded-full">
                          <Calendar className="w-4 h-4" />
                          <span>{entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date non disponible'}</span>
                        </div>
                      </div>
                      <div className="bg-paper p-6 rounded-xl text-gray-700 leading-relaxed italic">
                        "{entry.message}"
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
