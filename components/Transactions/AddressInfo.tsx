const axios = require('axios');
import { useState, useEffect } from 'react';
import SubTitle from 'components/SubTitle';
import { Flex, Button } from '@mantine/core'
import { currencyFormatter } from 'utils/formatCurrency'
import { BigNumberish } from 'ethers';

interface IntroCardProps {
  balance: BigNumberish;
  address: string;
  type: 'ETH' | 'MAT';
}

const IntroCard: React.FC<IntroCardProps> = ({ balance, address, type }) => {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [polyPrice, setPolyPrice] = useState<number>(0);
  const isEth = type === 'ETH'
  const multiplier = Number(isEth ? ethPrice : polyPrice)
  const url = isEth ? `https://etherscan.io/address/${address}` : `https://polygonscan.com/address/${address}`

  useEffect(() => {
    getCurrentEthPrice();
    getCurrentPolyPrice();
  }, [balance, address]);

  const getCurrentEthPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      setEthPrice(response.data.ethereum.usd)
    } catch (error: any) {
      console.error('Error fetching Ethereum price:', error.message);
    }
  }

  const getCurrentPolyPrice = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
      setPolyPrice(response.data['matic-network'].usd)
    } catch (error: any) {
      console.error('Error fetching Polygon price:', error.message);
    }
  }


  return (
    <Flex direction='column' m={40} w={200}>
      <SubTitle>{type} Balance</SubTitle>
      <p>{currencyFormatter(type).format(Number(balance))}</p>

      <SubTitle>{type} Price</SubTitle>
      <p>{currencyFormatter('USD').format(multiplier)}</p>

      <SubTitle>{type} Value</SubTitle>
      <p>{currencyFormatter('USD').format(Number(balance) * multiplier)}</p>

      <Button
        color='dark'
        variant='outline'
        mt={'1em'}
        onClick={() => window.open(url, '_ blank')}
      >
        {isEth ? 'Etherscan' : 'PolygonScan'}
      </Button>
    </Flex>
  );
};

export default IntroCard;
