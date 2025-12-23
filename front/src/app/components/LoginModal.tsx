import { useState } from 'react';
import { signIn } from '../../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';

export function LoginModal({
  onSuccess,
  onSignUp,
}: {
  onSuccess: (user: any) => void;
  onSignUp: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    setLoading(false);
    if (data?.user) {
      const userName = data.user.user_metadata?.name || data.user.email;
      onSuccess({
        ...data.user,
        displayName: userName,
      });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-lg shadow-2xl">
      <h2 className="text-4xl font-bold text-white mb-2">Добро пожаловать</h2>
      <p className="text-white/60 mb-8">Вход в аккаунт</p>
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-5 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Email</label>
          <Input
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder-white/40 h-12 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">Пароль</label>
          <Input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white placeholder-white/40 h-12 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold py-3 rounded-xl transition-colors text-base"
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>
      </form>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-zinc-900 text-white/50">или</span>
        </div>
      </div>
      <button
        onClick={onSignUp}
        className="w-full text-white/80 hover:text-white transition-colors text-sm py-3"
      >
        Нет аккаунта? <span className="text-yellow-500 font-semibold">Зарегистрироваться</span>
      </button>
    </div>
  );
}
