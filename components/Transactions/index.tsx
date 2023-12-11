import { MediaQuery, Card, TextInput, Loader, Flex, useMantineTheme } from '@mantine/core';
import { utils } from 'ethers';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components'
import Cell from './Cell'
import AddressInfo from './AddressInfo';
import { MRT_ColumnDef, MantineReactTable } from 'mantine-react-table';
import Title from 'components/Title';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTransactionsStore } from '../../store/transaction';
import { useAddressStore } from '../../store/address';
import { shortenAddress } from '../../utils'

export const Scanner = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 3em;
  font-weight: 400;
  width: 90%;
`

type TransactionData = {
  value: string
  hash: string
  from: string
  to: string
  date: string
  txChain: string
}

const Transactions = ({
  error,
  loading,
}: {
  error: any,
  loading: boolean
}) => {
  const {
    transactions,
    ethBalance,
    polyBalance,
  } = useTransactionsStore()
  const theme = useMantineTheme()

  const { address, updateAddress } = useAddressStore()
  const router = useRouter()

  useEffect(() => {
    if (address) {
      router.push({ query: { address } })
    }
  }, [address])

  const columns = useMemo<MRT_ColumnDef<Partial<TransactionData>>[]>(
    () => [
      {
        accessorKey: 'value',
        header: 'Amount',
        Cell: ({ cell }) => {
          return utils.formatEther(cell.getValue() as string)
        }
      },
      {
        accessorKey: 'hash',
        header: 'Hash',
        Cell: ({ cell, row }) => <Cell
          value={cell.getValue() as string}
          txChain={row.original.txChain}
          type='tx'
        />
      },
      {
        accessorKey: 'from',
        header: 'From',
        Cell: ({ cell, row }) => {
          return <Cell
            value={cell.getValue() as string}
            txChain={row.original.txChain}
            type='address'
          />
        }
      },
      {
        accessorKey: 'to',
        header: 'To',
        Cell: ({ cell, row }) => {
          return <Cell
            value={cell.getValue() as string}
            txChain={row.original.txChain}
            type='address'
          />
        }
      },
      {
        accessorKey: 'date',
        header: 'Date',
        Cell: ({ cell }) => {
          let utcSeconds = cell.getValue() as number;
          let d = new Date(0);
          d.setUTCSeconds(utcSeconds);

          return d.toLocaleString();
        }
      },
      {
        accessorKey: 'type',
        header: 'Chain',
        Cell: ({ cell }) => cell.getValue() as string,
      },
    ],
    [],
  );

  return (
    <Scanner>
      <TextInput
        placeholder="Search Transactions"
        label="Address"
        value={address}
        onChange={(event) => updateAddress(event.currentTarget.value)}
      />
      <Flex justify="center" align="center" gap={30} direction='column'>
        <Title style={{ marginBottom: '-5px' }}>Address</Title>
      </Flex>
      <Card shadow="sm" padding="lg" radius="md" withBorder>

        <Flex justify="center" align="center">
          {/* Full Address Large */}
          <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
            <p>{address}</p>
          </MediaQuery>

          {/* Short Address Small */}
          <MediaQuery largerThan="md" styles={{ display: 'none' }}>
            <p>{shortenAddress(address)}</p>
          </MediaQuery>
        </Flex>

        {/* Flex Row Large */}
        <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
          <Flex
            justify="center" align="center"
            gap={30}
            direction={'row'}
          >
            <AddressInfo address={address} balance={ethBalance} type={'ETH'} />
            <AddressInfo address={address} balance={polyBalance} type={'MAT'} />
          </Flex>
        </MediaQuery>
        {/* Flex Col Small  */}
        <MediaQuery largerThan="md" styles={{ display: 'none' }}>
          <Flex
            justify="center" align="center"
            gap={0}
            direction={'column'}
          >
            <AddressInfo address={address} balance={ethBalance} type={'ETH'} />
            <AddressInfo address={address} balance={polyBalance} type={'MAT'} />
          </Flex>
        </MediaQuery>
      </Card>

      <Flex justify="center" align="center">
        <Title>Transactions</Title>
      </Flex>
      <Flex justify="center" align="center">
        {
          error ? <div>Please check your address</div> :
            loading ?
              <Loader my={260} />
              :
              <MantineReactTable
                data={transactions}
                columns={columns}
                initialState={{
                  sorting: [
                    { id: 'date', desc: true }, //sort by state in ascending order by default
                  ],
                }}
                enableRowActions={true}
                renderRowActions={(table) => (
                  <Link
                    href={{
                      pathname: '/transaction',
                      query: {
                        transaction: table.row.original.hash,
                      },
                    }}
                  >
                    View
                  </Link>
                )}
              />
        }
      </Flex>
    </Scanner >
  )
}

export default Transactions
