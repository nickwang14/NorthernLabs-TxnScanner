
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
      try{
        const balance = await etherscanProvider.getBalance(address)
        setEthBalance(utils.formatEther(balance));
        setLoading(false);
      } catch {
        setError('Error fetching ETH balance')
        setLoading(false);
      }
    }

    const getPOLYBalance = async () => {
      try{
        const balance = await polygonProvider.getBalance(address)
        setPolyBalance(utils.formatEther(balance));
        setLoading(false);
        } catch {
          setError('Error fetching POLY balance')
          setLoading(false);
        }
    }

    const getETHTransactions = async () => {
      setLoading(true);
      try{
        const ethTxns = await axios.get(etherscanTxnListUrl)
        addPolyTransactions(ethTxns.data.result)
        setLoading(false);
        } catch {
          setError('Error fetching POLY balance')
          setLoading(false);
        }
    }

    const getPOLYTransactions = async () => {
      setLoading(true);
      try{
        const polyTxns = await axios.get(polygonscanTxnListUrl)
       
        addPolyTransactions(polyTxns.data.result)
        setLoading(false);
        } catch {
          setLoading(false);
          setError('Error fetching POLY balance')
          setLoading(false);
        }
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
