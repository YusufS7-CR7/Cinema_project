import { X, Star, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MovieDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  movie,
}: MovieDetailModalProps) {
  if (!isOpen) return null;

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
            className="relative bg-zinc-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors text-white"
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

              <div className="p-6 md:p-8 text-white">
                <h2 className="mb-4">{movie.title}</h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1.5 rounded">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold">{movie.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Eye className="w-5 h-5" />
                    <span>{movie.views.toLocaleString("ru-RU")} просмотров</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6 text-white/80">
                  <div className="flex gap-2">
                    <span className="text-white/60 min-w-[100px]">Год:</span>
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/60 min-w-[100px]">Жанр:</span>
                    <span>{movie.genre}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/60 min-w-[100px]">Страна:</span>
                    <span>{movie.country}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/60 min-w-[100px]">
                      Длительность:
                    </span>
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/60 min-w-[100px]">Режиссёр:</span>
                    <span>{movie.director}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/60 dark:text-white/60 light:text-zinc-500 min-w-[100px]">Актёры:</span>
                    <span>{movie.actors.join(", ")}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-white dark:text-white light:text-zinc-900">Описание</h3>
                  <p className="text-white/70 dark:text-white/70 light:text-zinc-600 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <button
                  onClick={() => movie.watchUrl && window.open(movie.watchUrl, '_blank')}
                  disabled={!movie.watchUrl}
                  className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black py-3 rounded-lg transition-colors"
                >
                  Смотреть
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
