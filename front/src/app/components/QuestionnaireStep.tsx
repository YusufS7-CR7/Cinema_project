import { motion } from "motion/react";

interface Option {
  id: string;
  label: string;
  image: string;
}

interface QuestionnaireStepProps {
  question: string;
  options: Option[];
  selectedOptions: string[];
  onToggleOption: (optionId: string) => void;
  multiSelect?: boolean;
}

export function QuestionnaireStep({
  question,
  options,
  selectedOptions,
  onToggleOption,
  multiSelect = false,
}: QuestionnaireStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <h2 className="text-center mb-12 text-white/90">
        {question}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <motion.button
              key={option.id}
              onClick={() => onToggleOption(option.id)}
              className={`relative overflow-hidden rounded-lg aspect-[3/4] group cursor-pointer ${
                isSelected ? "ring-4 ring-yellow-500" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={option.image}
                alt={option.label}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isSelected
                    ? "from-yellow-500/80 to-yellow-500/20"
                    : "from-black/80 to-black/20"
                } group-hover:from-yellow-500/60 group-hover:to-yellow-500/10 transition-all duration-300`}
              />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white z-10">{option.label}</span>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center z-10"
                >
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      {multiSelect && selectedOptions.length > 0 && (
        <p className="text-center mt-6 text-white/60 text-sm">
          Выбрано: {selectedOptions.length}
        </p>
      )}
    </motion.div>
  );
}
