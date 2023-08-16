import { Box, Spinner, VStack } from '@chakra-ui/react'
import React from 'react'

const Loader = () => {
  return (
    <VStack h={"90"} justifyContent={"center"}>
    <Box transform={"scale(3)"} mt={"45%"}>
    <Spinner size={"xl"}/>
    </Box>
    </VStack>
  )
}

export default Loader
