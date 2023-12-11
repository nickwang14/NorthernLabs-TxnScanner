import create from 'zustand'

interface FetchStatus {
  loading: boolean
  error: any
  setLoading: (loading: boolean) => void
  setError: (error: any) => void
}

export const useFetchStatusStore = create<FetchStatus>()((set) => ({
  loading: false,
  error: null,
  setLoading: (loading: boolean) => {
    set(() => ({
      loading,
    }))
  },
  setError: (error: any) => {
    set(() => ({
      error,
    }))
  },
}))
