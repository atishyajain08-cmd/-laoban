import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        void password;
        const stored = localStorage.getItem('laoban-users');
        const users: Array<{ name: string; email: string; password: string }> =
          stored ? JSON.parse(stored) : [];
        const found = users.find((u) => u.email === email);
        if (found) {
          set({
            user: { id: crypto.randomUUID(), name: found.name, email: found.email },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      signup: (name: string, email: string, password: string) => {
        const stored = localStorage.getItem('laoban-users');
        const users: Array<{ name: string; email: string; password: string }> =
          stored ? JSON.parse(stored) : [];
        if (users.some((u) => u.email === email)) return false;
        users.push({ name, email, password });
        localStorage.setItem('laoban-users', JSON.stringify(users));
        set({
          user: { id: crypto.randomUUID(), name, email },
          isAuthenticated: true,
        });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'laoban-auth' }
  )
);
