import { Star } from "lucide-react";
import { motion } from "motion/react";

interface MovieCardProps {
  title: string;
  year: number;
  genre: string;
  rating: number;
  image: string;
  duration: string;
  country: string;
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
  onClick,
}: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="bg-zinc-900 rounded-lg overflow-hidden cursor-pointer group shadow-lg"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-semibold">{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {title}
        </h3>
        <div className="space-y-1 text-sm text-white/60">
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