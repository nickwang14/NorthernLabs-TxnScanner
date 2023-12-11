import create from 'zustand'
import produce from 'immer'
import { Transaction, BigNumberish } from 'ethers'

export type TransactionReceipt = Transaction & {
  timeStamp?: number
  confirmations?: number
  blockNumber?: number
  cumulativeGasUsed?: number
  txreceipt_status?: number
  type?: string
}

export type formattedTransaction = Transaction & {
  value: string
  hash: string
  from: string
  to: string
  date: string
  type: string
  confirmations: number
  blockNumber?: number
  gasFee?: number
  status?: number
}

interface TransactionState {
  ethBalance: BigNumberish
  polyBalance: BigNumberish
  transactions: formattedTransaction[]
  addEthTransactions: (transaction: TransactionReceipt[]) => void
  addPolyTransactions: (transactions: TransactionReceipt[]) => void
  setEthBalance: (balance: BigNumberish) => void
  setPolyBalance: (balance: BigNumberish) => void
  resetTransactions: () => void
}

const formatTransaction = (tx: TransactionReceipt, type: string) => {
  let utcSeconds = tx.timeStamp as number;
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds);
  
  return {
    value: tx.value.toString(),
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    date: d.toLocaleString(),
    confirmations: tx.confirmations,
    blockNumber: tx.blockNumber,
    gasFee: tx.cumulativeGasUsed,
    status: tx.txreceipt_status,
    type
  }
}

export const useTransactionsStore = create<TransactionState>()((set) => ({
  ethBalance: '0',
  polyBalance: '0',
  transactions: [] as formattedTransaction[],
  setEthBalance: (balance: BigNumberish) => {
    set(() => ({
      ethBalance: balance,
    }))
  },
  setPolyBalance: (balance: BigNumberish) => {
    set(() => ({
      polyBalance: balance,
    }))
  },
  addEthTransactions: (transactions: TransactionReceipt[]) =>
    set(
      produce((draft) => {
        draft.transactions.push(...transactions.map(
          (tx) => formatTransaction(tx, 'ETH')
        ))
      })
    ),
  addPolyTransactions: (transactions: TransactionReceipt[]) =>
    set(
      produce((draft) => {
        draft.transactions.push(...transactions.map(
          (tx) => formatTransaction(tx, 'MAT')
        ))
      })
    ),
  resetTransactions: () => {
    set(() => ({
      ethBalance: '0',
      polyBalance: '0',
      transactions: [],
    }))
  }
}))
