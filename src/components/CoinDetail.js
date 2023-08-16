import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { server } from "../index";
import { useParams } from "react-router-dom";
import Error from "./Error";
import ChartComponent from "./ChartComponent";

const CoinDetail = () => {
  const [coin, SetCoin] = useState({});
  const [currency, SetCurrency] = useState("inr");
  const [loader, SetLoader] = useState(true);
  const [error, SetError] = useState(false);
  const [days,SetDays]=useState("24h")
  const [chartArray,SetChartArray]=useState([])

  const params = useParams();
  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

    const btns=["24h","7d","14d","30d","60d","200d","1y","max"]

    const switchChartStats = (key)=>{
         
        switch (key) {
          case "24h":
            SetDays("24h")
            break;
        
          case "7d":
            SetDays("7d")
            break;
        
          case "14d":
            SetDays("14d")
            break;
        
          case "30d":
            SetDays("30d")
            break;
        
          case "60d":
            SetDays("60d")
            break;
        
          case "200d":
            SetDays("200d")
            break;

          case "1y":
            SetDays("365d")  
            break;

          case "max":
            SetDays("max");
            break;

          default:
            SetDays("24h")
            break;

        }
    }

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        const{ data : chartData }=await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`)
        SetChartArray(chartData.prices)
        SetCoin(data);
        SetLoader(false);
      } catch (error) {
        SetError(true);
        SetLoader(false);
      }
    };
    fetchCoin();
  }, [params.id,currency,days]);

  if (error) {
    return <Error />;
  }

  return (
    <Container maxW={"container.xl"}  >
      {loader ? (
        <Loader />
      ) : (
        <>
           <Box width={"full"} borderWidth={1} >
           <ChartComponent arr={chartArray} currency={currencySymbol} days={days} /> 
           </Box>

           <HStack p={"4"} wrap={"wrap"} overflowX={"auto"}>
           {
              btns.map((i)=>(
                <Button key={i} onClick={()=> switchChartStats(i)} >{i}</Button>
              ))
           }
           </HStack>

          <RadioGroup value={currency} onChange={SetCurrency}>
            <HStack spacing={"4"} >
              <Radio value="inr">INR</Radio>
              <Radio value="eur">EUR</Radio>
              <Radio value="usd">USD</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={"0.7"}>
              Last Updated On{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>

            <Image
              src={coin.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            ></Image>

            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>

            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.800"}
              color={"white"}
            >{`#${coin.market_data.market_cap_rank}`}</Badge>

            <CustomBar high={`${currencySymbol} ${coin.market_data.high_24h[currency]}`} 
                       low={`${currencySymbol} ${coin.market_data.low_24h[currency]}`} />

            <Box w={"full"} p={"4"}>
                 <Item title={"Max Supply"} value={coin.market_data.max_supply} />
                 <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply} />
                 <Item title={"Market Capital"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
                 <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
                 <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />
            </Box>           
          </VStack>
        </>
      )}
    </Container>
  );
};

const CustomBar = ({ high, low }) => {
    return(
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range </Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>)
};

const Item=({title,value})=>{
    return(
     <HStack justifyContent={"space-between"} w={"full"} my={"4"} >
          <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"} >{title}</Text>
          <Text>{value}</Text>
     </HStack>)
}

export default CoinDetail;
