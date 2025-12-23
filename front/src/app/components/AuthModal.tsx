import { useState } from "react";
import { X, LogIn, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, name || email.split("@")[0]);
      setEmail("");
      setPassword("");
      setName("");
    }
  };

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
            className="relative bg-zinc-900 rounded-xl max-w-md w-full shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                  {isLoginMode ? (
                    <LogIn className="w-8 h-8 text-black" />
                  ) : (
                    <User className="w-8 h-8 text-black" />
                  )}
                </div>
                <h2 className="text-white mb-2">
                  {isLoginMode ? "Вход" : "Регистрация"}
                </h2>
                <p className="text-white/60">
                  {isLoginMode
                    ? "Войдите в свой аккаунт"
                    : "Создайте новый аккаунт"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Введите имя"
                      required={!isLoginMode}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-white mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Введите email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Введите пароль"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg transition-colors mt-6"
                >
                  {isLoginMode ? "Войти" : "Зарегистрироваться"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm"
                >
                  {isLoginMode
                    ? "Нет аккаунта? Зарегистрируйтесь"
                    : "Уже есть аккаунт? Войдите"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
