import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      currentUser: null,

      login: (userData) => set({
        isAuth: true,
        currentUser: userData
      }),

      logout: () => set({
        isAuth: false,
        currentUser: null
      }),

      updateUserData: (newData) => set({
        currentUser: { ...get().currentUser, ...newData }
      }),

      checkAuth: () => get().isAuth,

      getUserData: (key) => get().currentUser?.[key],
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuth: state.isAuth,
        currentUser: state.currentUser,
      }),
    }
  )
)

export default useAuthStore