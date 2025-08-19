import { create } from 'zustand'

// Define the store interface
interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// Create the store
const useTokenStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('token') || null, // Initialize from localStorage

  // Set the token when login is successful
  setToken: (token: string) => {
    localStorage.setItem('token', token); // Save token to localStorage
    set({ token });
  },

  // Clear the token (e.g., on logout)
  clearToken: () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    set({ token: null });
  },
}));

export default useTokenStore;
