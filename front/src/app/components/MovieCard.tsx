import { Star, Play } from "lucide-react";
import { motion } from "motion/react";

interface MovieCardProps {
  title: string;
  year: number;
  genre: string;
  rating: number;
  image: string;
  duration: string;
  country: string;
  type?: "movie" | "series";
  theme?: "dark" | "light";
  onClick?: () => void;
}

export function MovieCard({
  title,
  year,
  genre,
  rating,
  image,
  duration,
  country,
  type,
  theme = "dark",
  onClick,
}: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`${theme === "dark" ? "bg-zinc-900" : "bg-white"} rounded-lg overflow-hidden cursor-pointer group shadow-lg ${theme === "light" ? "border border-gray-200" : ""}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/90 flex items-center justify-center text-black">
            <Play className="w-8 h-8 ml-1 fill-current" />
          </div>
        </div>

        <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded flex items-center gap-1 z-10">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-semibold">{rating.toFixed(1)}</span>
        </div>
        
        {type && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium z-10 uppercase tracking-wider">
            {type === "movie" ? "Фильм" : "Сериал"}
          </div>
        )}
      </div>
      <div className="p-4 relative z-10">
        <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"} mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors font-semibold`}>
          {title}
        </h3>
        <div className={`space-y-1 text-sm ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
          <p>
            {year} • {genre}
          </p>
          <p>
            {country} • {duration}
          </p>
        </div>
      </div>
    </motion.div>
  );
}