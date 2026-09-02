import React, { Component, ReactNode, ErrorInfo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue est survenue.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes("insufficient permissions")) {
            errorMessage = "Vous n'avez pas les permissions nécessaires pour effectuer cette action.";
          }
        }
      } catch (e) {
        // Not JSON, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
          <div className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Oups !</h2>
            <p className="text-gray-600 mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
