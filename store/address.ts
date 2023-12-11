import create from 'zustand'
import { defaultWallet } from 'constants/wallet'
import { useTransactionsStore } from './transaction'

interface TransactionState {
  address: string
  updateAddress: (address: string) => void
  resetAddress: () => void
}

export const useAddressStore = create<TransactionState>()((set) => ({
  address: defaultWallet,
  updateAddress: (address?: string) => {
    const { resetTransactions } = useTransactionsStore.getState()
    if (address) {
      set(() => ({
        address,
      }))
      resetTransactions()
    }
  },
  resetAddress: () => {
    const { resetTransactions } = useTransactionsStore.getState()
    set(() => ({
      address: defaultWallet,
    }))
    resetTransactions()
  }
}))
