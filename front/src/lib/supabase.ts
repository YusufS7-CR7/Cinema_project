import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing. Auth will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type AuthUser = {
  id: string;
  email?: string;
};

export async function signUp(email: string, password: string, name?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || email.split('@')[0] },
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email,
      });
    } else {
      callback(null);
    }
  });

  return () => {
    data?.subscription?.unsubscribe();
  };
}
