import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { server } from '../index'
import Error from './Error';
import { Container, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import Loader from './Loader';

const Exchanges = () => {
   const[Exchanges,SetExchanges]=useState([]);
   const[loader,SetLoader]=useState(true);
   const[error,SetError]=useState(false);

   useEffect(()=>{
       const fetchExchanges = async() =>{
           try {
             const {data} = await axios.get(`${server}/exchanges`)
             console.log(data);
             SetExchanges(data);
             SetLoader(false);

           } catch (error) {
            console.log(error);
            SetError(true);
            SetLoader(false);
           }
       } 
       fetchExchanges();
   },[])

   if (error===true) {
      return <Error/>
   }
  return (
    <Container maxW={'container.xl'}>
    {
        loader?<Loader/>:(
            <>
            <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
              {Exchanges.map((i)=>{
                return(
                   <ExchangeCard key={i.id} name={i.name} img={i.image} rank={i.trust_score_rank} url={i.url} />)   
              })}
            </HStack>
            </>
        )} 
    </Container>
  );
}


const ExchangeCard=({key,name,img,rank,url })=>{
    return(
    <a href={url} target='blank'>
    <VStack w={"52"} shadow={"lg"} p={"8"} borderRadius={"lg"} margin={"4"} transition={"all 0.3s"} css={
        {
            "&:hover":{
                transform:"scale(1.1)",
            },
        }
    } key={key} >
    <Image src={img} w={"10"} h={"10"} objectFit={"contain"} alt="Exchange" />
    <Heading size={"md"} noOfLines={1}>
       {rank}
    </Heading>

    <Text noOfLines={1}>{name}</Text>
    </VStack>
    </a>)
};

export default Exchanges;
