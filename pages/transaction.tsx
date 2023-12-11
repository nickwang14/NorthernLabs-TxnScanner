import { Card, useMantineTheme, MediaQuery, Flex, Loader } from '@mantine/core';
import styled from 'styled-components'
import Title from 'components/Title';
import { useRouter } from 'next/router';
import { useTransactionsStore } from 'store/transaction';
import SubTitle from 'components/SubTitle';
import { ethers } from 'ethers';
import { shortenAddress } from '../utils'
import useLoadData from '../hooks/useLoadData';
import { useFetchStatusStore } from 'store/fetchStatus';

export const Scanner = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 3em;
  font-weight: 400;
  width: 90%;
`

const TransactionDetails = () => {
  useLoadData();
  const router = useRouter()
  const theme = useMantineTheme()
  const { transactions } = useTransactionsStore()
  const { loading } = useFetchStatusStore()
  const transactionHash = router.query.transaction
  const transaction = transactions.find((tx) => tx.hash === transactionHash)
  const isEth = transaction?.type === 'ETH'
  const txUrl = isEth ? `https://etherscan.io/tx/${transactionHash}` : `https://polygonscan.com/tx/${transactionHash}`
  const addressUrl = isEth ? `https://etherscan.io/address/${transactionHash}` : `https://polygonscan.com/address/${transactionHash}`

  return (
    <Scanner>
      <Flex direction='column' align={'center'}>
        <Title>Transaction Details</Title>
        <Flex align={'flex-end'} gap={10}>
          <SubTitle style={{ marginTop: theme.breakpoints.lg ? '0' : '3px' }}>Transaction Hash:</SubTitle>

          {/* Full Address Large */}
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <a href={txUrl} target='_blank'>
              {transactionHash}
            </a>
          </MediaQuery>

          {/* Short Address Small */}
          <MediaQuery largerThan="md" styles={{ display: 'none' }}>
            <a href={txUrl} target='_blank'>
              {shortenAddress(transactionHash as string)}
            </a>
          </MediaQuery>
        </Flex>
      </Flex>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {loading ?
          (
            <Flex justify={'center'}>
              <Loader />
            </Flex>
          ) : (
            <Flex direction='column'>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Chain: </SubTitle>
                <p>{isEth ? 'Ethereum' : 'Polygon'}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Amount: </SubTitle>
                <p>{ethers.utils.formatEther(transaction?.value || 0)}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Date: </SubTitle>
                <p>{transaction?.date}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Block: </SubTitle>
                <p>{transaction?.blockNumber}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Confirmations: </SubTitle>
                <p>{transaction?.confirmations}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Gas Fee: </SubTitle>
                <p>{ethers.utils.formatEther(transaction?.gasFee || 0)}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>Status: </SubTitle>
                <p>{transaction?.status ? 'Successful' : 'Reverted'}</p>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>From: </SubTitle>
                {/* Full Address Large */}
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <a href={addressUrl} target='_blank'>
                    {transaction?.from}
                  </a>
                </MediaQuery>

                {/* Short Address Small */}
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                  <a href={addressUrl} target='_blank'>
                    {shortenAddress(transaction?.from as string)}
                  </a>
                </MediaQuery>
              </Flex>
              <Flex align={'flex-end'} gap={10}>
                <SubTitle style={{ marginBottom: '-3px' }}>To: </SubTitle>
                {/* Full Address Large */}
                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                  <a href={addressUrl} target='_blank'>
                    {transaction?.to}
                  </a>
                </MediaQuery>

                {/* Short Address Small */}
                <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                  <a href={addressUrl} target='_blank'>
                    {shortenAddress(transaction?.to as string)}
                  </a>
                </MediaQuery>
              </Flex>
            </Flex>
          )}
      </Card>

    </Scanner >
  )
}

export default TransactionDetails
