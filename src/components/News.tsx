import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Tag, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { SITE_CONTENT } from "../constants";

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

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  link?: string;
  content?: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'news';
    const q = query(collection(db, path), orderBy('publishedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreNews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];
      
      // Merge with static news from constants
      const allNews = [...SITE_CONTENT.news, ...firestoreNews];
      // Remove duplicates if any (by id)
      const uniqueNews = Array.from(new Map(allNews.map(item => [item.id, item])).values());
      
      setNews(uniqueNews);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      // Even if firestore fails, show static news
      setNews(SITE_CONTENT.news);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="actualites" className="py-24 px-6 bg-paper">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Actualités & Chroniques</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold mb-0 leading-tight">
              Nos dernières réflexions sur le monde de l'IT.
            </h3>
          </div>
          <a
            href="#actualites"
            className="px-8 py-4 border border-primary/20 rounded-full font-medium hover:bg-accent/5 transition-all flex items-center gap-2 group"
          >
            Voir tous les articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </div>
                  </div>
                  <h4 className="text-2xl font-serif font-bold mb-4 group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 mb-8 line-clamp-2">
                    {item.excerpt}
                  </p>
                  
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest group/link"
                    >
                      {item.link.includes("linkedin.com") ? "Lire sur LinkedIn" : "Découvrir l'article"}
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={`/actualites/${item.id}`}
                      className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest group/link text-primary"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500">Aucun article disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
