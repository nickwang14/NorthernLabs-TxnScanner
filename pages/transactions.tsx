
import Transactions from 'components/Transactions'
import { useFetchStatusStore } from 'store/fetchStatus';
import useLoadData from '../hooks/useLoadData';

const TransactionsPage = () => {
  const { error, loading } = useFetchStatusStore()

  useLoadData();

  return (
    <Transactions
      error={error}
      loading={loading}
    />
  )
}

export default TransactionsPage
