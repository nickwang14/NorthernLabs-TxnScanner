import React from 'react'
import styled from 'styled-components'
// import Settings from 'components/base/Settings'
import { Button } from '@mantine/core'
import { useRouter } from 'next/router'
import { Flex } from '@mantine/core'
import { socialsArray } from 'config/menu'
import { IconArrowBack } from '@tabler/icons-react'


const Row = styled.header`
  display: flex;
  padding: 2% 5%;
  flex-flow: row wrap;
  align-items: center;
`

const Item = styled.a`
  display: flex;
  margin: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #94a3b8;
`

export const Header = () => {
  const router = useRouter()
  const isHome = router.pathname === '/transactions'

  return (
    <Row>
      <Flex justify='space-between' w={'100%'}>
        <Button
          color='dark'
          onClick={() => isHome ? router.push('/') : router.back()}
        >
          {isHome ? 'Refresh' : <><IconArrowBack /> Home</>}
        </Button>
        <Flex>
          {socialsArray.map((item) => {
            return (
              <Item href={item.link} target="_blank" key={item.name}>
                {item.name}
              </Item>
            )
          })}
        </Flex>
        {/* <Settings /> */}
      </Flex>
    </Row>
  )
}
