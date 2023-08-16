import React, { useEffect, useState } from 'react'
import { server } from '../index'
import axios from 'axios';
import Loader from './Loader';
import Error from './Error';
import CoinCard from './CoinCard'
import { Button, Container, HStack, Radio, RadioGroup } from '@chakra-ui/react';

const Coins = () => {
    const[coins,SetCoins]=useState([]);
    const[currency,SetCurrency]=useState("inr");
    const[page,SetPage]=useState(1);
    const[loader,SetLoader]=useState(true);
    const[error,SetError]=useState(false);

    const currencySymbol=currency==="inr"?"₹" : currency === "eur" ? "€" : "$";

    const changePage = (page) =>{
        SetPage(page);
        SetLoader(false);
    }

    const btns=new Array(132).fill(1);

    useEffect(()=>{
        const fetchCoins=async()=>{
            try {
                const {data}=await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`)
                SetCoins(data);
                SetLoader(false);
            } catch (error) {
                SetError(true);
                SetLoader(false);
            }
        }
        fetchCoins();
    },[currency,page])

    if (error) {
        return <Error/>;
    }

  return (
    <Container maxW={'container.xl'}>
    {loader?(<Loader/>):
    (<>
       <RadioGroup value={currency} onChange={SetCurrency}>
       <HStack spacing={"4"}>
        <Radio value="inr" >INR</Radio>
        <Radio value="eur" >EUR</Radio>
        <Radio value="usd" >USD</Radio>
       </HStack>
       </RadioGroup> 

       <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
       {coins.map((i)=>{
           return(
           <CoinCard id={i.id} key={i.id}
           name={i.name}
           price={i.current_price}
           img={i.image}
           symbol={i.symbol} 
           currencySymbol={currencySymbol}
           />)
       })  
       }
       </HStack>
         
       <HStack w={"full"} overflowX={"auto"} p={"8"}>
             {
                btns.map((item,index)=>{
                    return(
                    <Button key={index} bgColor={'blackAlpha.900'} color={"white"} onClick={()=> changePage(index+1)}>
                     {index+1}
                    </Button>)
                })
             }
       </HStack>
    </>
    )}
    </Container>
    );
}

export default Coins;
