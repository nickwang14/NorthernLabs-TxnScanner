import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { shortenAddress } from 'utils'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Button } from '@mantine/core'
import { useAddressStore } from '../../store/address'

import Modal from '../Modal'

const Settings = () => {
  const { account, provider, chainId } = useWeb3React()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { updateAddress } = useAddressStore()

  useEffect(() => {
    updateAddress(account || '')
  }, [account])

  return (
    <>
      {!account || !provider || !chainId ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant='outline'
          color='dark'
        >Connect</Button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          variant='outline'
          color='dark'
        >
          <Jazzicon diameter={15} seed={account ? jsNumberForAddress(account) : 0} />
          <div style={{ marginLeft: '.7em' }}> {shortenAddress(account)}</div>
        </Button>
      )}
      {<Modal isOpen={isOpen} close={() => setIsOpen(false)} />}
    </>
  )
}

export default Settings
