import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Tag, Share2, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SITE_CONTENT } from "../constants";
import Header from "./Header";
import Footer from "./Footer";

export default function ArticleView() {
  const { id } = useParams();
  const article = SITE_CONTENT.news.find(item => item.id === id);

  useEffect(() => {
    if (!article) return;
    const canonicalUrl = `${window.location.origin}/actualites/${article.id}`;
    const previousTitle = document.title;
    document.title = `${article.title} | Valeurs IT`;

    const restoreMeta: Array<() => void> = [];
    const updateMeta = (selector: string, content: string) => {
      const element = document.head.querySelector(selector);
      if (!element) return;
      const previous = element.getAttribute("content");
      element.setAttribute("content", content);
      restoreMeta.push(() => {
        if (previous === null) element.removeAttribute("content");
        else element.setAttribute("content", previous);
      });
    };

    updateMeta('meta[name="description"]', article.excerpt);
    updateMeta('meta[property="og:type"]', "article");
    updateMeta('meta[property="og:title"]', article.title);
    updateMeta('meta[property="og:description"]', article.excerpt);
    updateMeta('meta[property="og:url"]', canonicalUrl);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    canonical?.setAttribute("href", canonicalUrl);

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.id === "maitrise-dependances-01" ? "2026-11-10" : undefined,
      author: { "@type": "Person", name: "Alain Nguyen" },
      publisher: { "@type": "Organization", name: "Valeurs IT" },
      mainEntityOfPage: canonicalUrl,
      image: article.image.startsWith("http") ? article.image : `${window.location.origin}${article.image}`
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      restoreMeta.forEach(restore => restore());
      if (canonical) {
        if (previousCanonical === null) canonical.removeAttribute("href");
        else canonical.setAttribute("href", previousCanonical);
      }
      schema.remove();
    };
  }, [article]);

  if (!article) {
    return <Navigate to="/" replace />;
  }

  // Estimate reading time
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-12">
            <Link 
              to="/#actualites" 
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour aux actualités
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </div>
                {article.date && <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </div>}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {readingTime} min de lecture
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-10 leading-tight text-primary">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-accent pl-8 mb-12">
                {article.excerpt}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl mb-16"
            >
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-none"
          >
            <div className="markdown-body">
              <ReactMarkdown>{article.content || ""}</ReactMarkdown>
            </div>
          </motion.div>

          {/* Footer of article */}
          <footer className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <img 
                src="/photo-alain-nguyen.jpg"
                alt="Alain Nguyen"
                className="w-16 h-16 rounded-2xl object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/logo-valeurs-it.png"; }}
              />
              <div>
                <div className="font-bold text-primary">Alain Nguyen</div>
                <div className="text-sm text-gray-400">Fondateur Valeurs IT</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Partager</span>
              <button className="w-12 h-12 rounded-full bg-paper flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}

