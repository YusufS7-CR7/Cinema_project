import { X, Star, Eye, Link } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface MovieDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
  movie: {
    title: string;
    year: number;
    genre: string;
    rating: number;
    image: string;
    duration: string;
    country: string;
    description: string;
    views: number;
    director: string;
    actors: string[];
    watchUrl?: string;
  };
}

export function MovieDetailModal({
  isOpen,
  onClose,
  theme = "dark",
  movie,
}: MovieDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (movie.watchUrl) {
      navigator.clipboard.writeText(movie.watchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative ${isDark ? "bg-zinc-900" : "bg-white"} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 p-2 ${isDark ? "bg-black/50 hover:bg-black/70 text-white" : "bg-white/50 hover:bg-white/80 text-gray-900"} backdrop-blur-sm rounded-full transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[400px]">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                />
              </div>

              <div className={`p-6 md:p-8 ${isDark ? "text-white" : "text-gray-900"}`}>
                <h2 className="mb-4 text-3xl font-bold">{movie.title}</h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1.5 rounded">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isDark ? "text-white/70" : "text-gray-600"}`}>
                    <Eye className="w-5 h-5" />
                    <span>{movie.views.toLocaleString("ru-RU")} просмотров</span>
                  </div>
                </div>

                <div className={`space-y-4 mb-6 ${isDark ? "text-white/80" : "text-gray-700"}`}>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>Год:</span>
                    <span className="font-medium">{movie.year}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>Жанр:</span>
                    <span className="font-medium">{movie.genre}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>Страна:</span>
                    <span className="font-medium">{movie.country}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>
                      Длительность:
                    </span>
                    <span className="font-medium">{movie.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>Режиссёр:</span>
                    <span className="font-medium">{movie.director}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className={`${isDark ? "text-white/50" : "text-gray-500"} min-w-[100px]`}>Актёры:</span>
                    <span className="font-medium">{movie.actors.join(", ")}</span>
                  </div>
                </div>

                <div>
                  <h3 className={`mb-3 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Описание</h3>
                  <p className={`${isDark ? "text-white/70" : "text-gray-600"} leading-relaxed`}>
                    {movie.description}
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <a
                    href={movie.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${!movie.watchUrl ? 'pointer-events-none opacity-50 bg-gray-400' : ''}`}
                  >
                    Смотреть
                  </a>
                  
                  {movie.watchUrl && (
                    <button
                      onClick={handleShare}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        isDark 
                          ? "bg-zinc-800 hover:bg-zinc-700 text-white" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                      title="Скопировать ссылку"
                    >
                      <Link className="w-5 h-5" />
                      <span className="hidden sm:inline">
                        {copied ? "Скопировано!" : "Поделиться"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
