import { HStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const Header = () => {
  return (
    <HStack bg={'blackAlpha.900'} p={'4'} gap={'7'} shadow={'base'} >
      <Button variant={"unstyled"} color={'white'}> 
      <Link to={'/'}>Home</Link>
      </Button>
      <Button variant={"unstyled"} color={'white'}>
      <Link to={'/exchanges'}>Exchanges</Link>
      </Button>
      <Button variant={"unstyled"} color={'white'}>
      <Link to={'/coins'}>Coins</Link>
      </Button>
    </HStack>
  )
}

export default Header;
