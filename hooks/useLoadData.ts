
import { providers, utils } from 'ethers';
import { useEffect } from 'react';
import axios from 'axios';
import { useTransactionsStore } from 'store/transaction';
import { useAddressStore } from 'store/address';
import { useFetchStatusStore } from 'store/fetchStatus';

const alchemyPolygonApiKey = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_RPC_API_KEY;
const polygonScanApiKey = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY;
const etherScanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

const useLoadData = () => {
  const {
    transactions,
    addEthTransactions,
    addPolyTransactions,
    setEthBalance,
    setPolyBalance,
  } = useTransactionsStore()
  const { address } = useAddressStore()
  const { setError, setLoading } = useFetchStatusStore()

  const etherscanProvider = new providers.EtherscanProvider();
  const etherscanTxnListUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherScanApiKey}`;
  const polygonscanTxnListUrl = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${polygonScanApiKey}`;
  const polygonProvider = new providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyPolygonApiKey}`);

  useEffect(() => {
    const getETHBalance = async () => {
      setLoading(true);
      await etherscanProvider.getBalance(address)
        .then((balance) => {
          setEthBalance(utils.formatEther(balance));
        })
        .catch(error => {
          setError(error)
        });
    }

    const getPOLYBalance = async () => {
      setLoading(true);
      await polygonProvider.getBalance(address)
        .then((balance) => {
          setPolyBalance(utils.formatEther(balance));
        })
        .catch(error => {
          setError(error)
        });
    }

    const getETHTransactions = async () => {
      setLoading(true);
      await axios.get(etherscanTxnListUrl)
        .then((response) => {
          setLoading(false);
          setError(null)
          addEthTransactions(response.data.result)
        })
        .catch(error => {
          setLoading(false);
          setError(error)
        });
    }

    const getPOLYTransactions = async () => {
      setLoading(true);
      await axios.get(polygonscanTxnListUrl)
        .then((response) => {
          setLoading(false);
          setError(null)
          addPolyTransactions(response.data.result)
        })
        .catch((error) => {
          setLoading(false);
          setError(error)
        }
        );
    }

    if(transactions && transactions.length === 0) {
      getETHBalance();
      getPOLYBalance();
      getETHTransactions();
      getPOLYTransactions();
    }
  }, [address]);
}

export default useLoadData
