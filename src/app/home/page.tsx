'use client';
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useEffect, useState } from 'react';

import { useSearchParams, redirect } from 'next/navigation';

import supabase from 'config/supabaseClient';

import { createThirdwebClient, defineChain, getContract, toEther, getUser, prepareContractCall } from 'thirdweb';
import { ConnectButton, useActiveWalletConnectionStatus, useConnectModal, useActiveAccount, useSwitchActiveWalletChain, useReadContract, TransactionButton, useSendTransaction, useContractEvents } from "thirdweb/react";
import {sepolia, baseSepolia, arbitrumSepolia, base} from "thirdweb/chains";
import { smartWallet } from "thirdweb/wallets";
import { claimTo as claimERC20, balanceOf as balanceOfERC20 } from "thirdweb/extensions/erc20";

import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";

// Chakra imports

import {
  Box,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,

  Flex,

  Image,
  Input,
  InputAddon,
  InputLeftAddon,
  InputLeftElement,
  InputGroup,
  Icon,
  
  Select,
  SimpleGrid,
  
  Text,
  useColorModeValue,
  AspectRatio,
  
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,

  Stack,

  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,

  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,

  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

  VStack,
  HStack,

  Theme,
  useToast,
  Link,
  Grid,
  useEditable,
} from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

import { CldImage } from 'next-cloudinary';
import Cloudinary from 'cloudinary';

// Custom components
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import Portfolio from 'views/admin/marketplace/components/Portfolio';

import tableDataDevelopment from 'views/admin/dataTables/variables/tableDataDevelopment';
import tableDataCheck from 'views/admin/dataTables/variables/tableDataCheck';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';
import tableDataComplex from 'views/admin/dataTables/variables/tableDataComplex';
import tableDataTopCreators from 'views/admin/marketplace/variables/tableDataTopCreators';

import HistoryItem from 'views/admin/marketplace/components/HistoryItem';
import NFT from 'components/card/NFT';
import Card from 'components/card/Card';

import LatestTransactions from 'views/admin/marketplace/components/LatestTransactions';
import LastTransactions from 'views/admin/marketplace/components/LastTransactions';
import PieChart from 'views/admin/default/components/AssetPieChart';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import AdminLayout from 'layouts/admin';
import TotalSaved from 'views/admin/default/components/TotalSaved';
import BuyStocks from 'components/card/BuyStocks';
import BuyETFs from 'components/card/BuyETFs';
import BuyCrypto from 'components/card/BuyCrypto';
import SellAssets from 'components/card/SellAssets';
import DepositFunds from 'components/card/DepositFunds';
import WithdrawFunds from 'components/card/WithdrawFunds';
import GoalTrackerLong from 'views/admin/default/components/GoalTrackerLong';

import TradingViewWidget from 'components/charts/TradingViewWidget';
import TradingViewCandle from 'components/charts/TradingViewCandle';

import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdPayment,
  MdRedeem,
} from 'react-icons/md';

// Assets
import Usa from 'img/dashboards/usa.png';
import goal1 from '/public/img/goals/1.jpg';
import goal2 from '/public/img/goals/2.jpg';
import goal3 from '/public/img/goals/3.jpg';
import goal4 from '/public/img/goals/4.jpg';
import goal5 from '/public/img/goals/5.jpg';
import goal6 from '/public/img/goals/6.jpg';
import loading from '/public/img/loading.gif';

import Nft1 from 'img/nfts/Nft1.png';
import Nft2 from 'img/nfts/Nft2.png';
import Nft3 from 'img/nfts/Nft3.png';

import ARKB from 'img/etfs/ark.jpg';
import BITB from 'img/etfs/bitwise.jpg';
import EZBC from 'img/etfs/franklin.jpg';
import DEFI from 'img/etfs/hashdex.jpg';
import BTCO from 'img/etfs/invesco.jpg';
import PHO from 'img/etfs/invesco.jpg';
import WOOD from 'img/etfs/ishares.jpg';
import SPY from 'img/etfs/spdr.jpg';
import SLX from 'img/etfs/vaneck.jpg';

import AAPL from 'img/stocks/AAPL.png';
import AMZN from 'img/stocks/AMZN.png';
import COIN from 'img/stocks/COIN.png';
import DIS from 'img/stocks/DIS.png';
import GOOGL from 'img/stocks/GOOGL.png';
import NFLX from 'img/stocks/NFLX.png';
import NVDA from 'img/stocks/NVDA.png';
import MSFT from 'img/stocks/MSFT.png';
import PYPL from 'img/stocks/PYPL.png';

import BTC from 'img/crypto/btc.png';
import ETH from 'img/crypto/eth.png';
import USDC from 'img/crypto/usdc.png';

import stocks from 'img/products/stocks.jpg';
import sandp from 'img/stocks/SANDP.png';

import mobilemoney from '/public/img/avatars/EcoCash.jpg';
import mobilemoney1 from '/public/img/avatars/innbucks.jpg';

export default function HomePage() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [fetchError, setFetchError] = useState(null);
  const [userData, setUserData] = useState(null);

  // const user = useUser();
  // const { client } = useSmartAccountClient({
  //   type: "MultiOwnerModularAccount",
  // });

  const client3rdWeb = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  });

  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.BASE_SEPOLIA,
  };

  // Cloudinary.v2.config({
  //   cloud_name: 'samespaces',
  //   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  //   api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
  // });

  const alchemy = new Alchemy(config);

  const searchParams = useSearchParams();
  
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [showModal, setShowModal] = useState(false);
  const [sellAssets, setSellAssets] = useState(false);
  const [depositFunds, setDepositFunds] = useState(false);
  const [withdrawFunds, setWithdrawFunds] = useState(false);
  const [claimTokens, setClaimTokens] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState(18);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idUrl, setIdUrl] = useState("");

  const [saved, setSaved] = useState(false);
  const [depositSaved, setDepositSaved] = useState(false);
  const [withdrawalSaved, setWithdrawalSaved] = useState(false);

  const [depositorName, setDepositorName] = useState("");
  const [depositorWalletAddress, setDepositorWalletAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState(1);
  const [depositorPhoneNumber, setDepositorPhoneNumber] = useState("");

  const [withdrawalName, setWithdrawalName] = useState("");
  const [withdrawalWalletAddress, setWithdrawalWalletAddress] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState(1);
  const [withdrawalPhoneNumber, setWithdrawalPhoneNumber] = useState("");  

  const [goalOne, setGoalOne] = useState(false);
  const [goalTwo, setGoalTwo] = useState(false);
  const [goalThree, setGoalThree] = useState(false);
  const [goalFour, setGoalFour] = useState(false);
  const [goalFive, setGoalFive] = useState(false);
  const [goalSix, setGoalSix] = useState(false);

  const [amountPaid, setAmountPaid] = useState(1);

  const [growthChart, setGrowthChart] = useState(true);
  const [portfolio, setPortfolio] = useState(false);

  const [paymentChoice, setPaymentChoice] = useState(true);
  const [withdrawalChoice, setWithdrawalChoice] = useState(true);

  const [transferTransactions, setTransferTransactions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const [stockClosePrice, setStockClosePrice] = useState(0);

  const toast = useToast();

  const account = useActiveAccount();
  const walletAddress = account?.address || "";

  const TOKEN_CONTRACT = "0xC92575734B437DF10bc44505D96Ac9a555D1740A";
  const DROP_CONTRACT = "0x50745C5e2e02C4657eE3D74EcE4a91c35f10120f";
  const DEX_CONTRACT = "0xbe3770d65275aF5f0c56ee4dde13747D4B15c7d1";
  const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  const switchChain = useSwitchActiveWalletChain();

  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  const USDC_CONTRACT_RETRIEVED = getContract({
    client: client3rdWeb,
    chain: defineChain(base),
    address: USDC_CONTRACT
  });

  const {data: blncOfERC20} = useReadContract(
    balanceOfERC20,
    {
      contract: getContract({
        client: client3rdWeb,
        chain: defineChain(base),
        address: DROP_CONTRACT
      }),
      address: walletAddress as `0x${string}` || ""  as `0x${string}`
    }
  );

  const {data: blncOfERC20USDC} = useReadContract(
    balanceOfERC20,
    {
      contract: USDC_CONTRACT_RETRIEVED,
      address: walletAddress as `0x${string}` || ""  as `0x${string}`
    }
  );

  const tokenContractSPY = getContract(
    {
      client: client3rdWeb,
      chain: defineChain(base),
      address: DROP_CONTRACT
    }
  );

  const steps = [
    { title: '1', description: 'Info' },
    { title: '2', description: 'Goals' },
    { title: '3', description: 'Finish' },
  ]
  
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  function removeEmptyStrings(arr: string[]): string[] {
    return arr.filter((element) => element.trim() !== "");
  }

  // Custom components
  // Assets

  type TransactionRowObj = {
    action: string;
    asset: string;
    value: number;
  };
  
  type User = {
    // Define the properties of your user object here
    name : string; 
    surname : string; 
    email: string;
    age:  number;
    phone_number : string; 
    home_address : string; 
    city : string; 
    country : string;
    wallet_address : string;
    saving_objectives : string;
  };

  type DepositRequest = {
    // Define the properties of your object here
    username : string; 
    wallet_address : string;
    amount:  number;
    phone_number : string;
    provider : string;
  };

  type WithdrawalRequest = {
    // Define the properties of your object here
    username : string; 
    wallet_address : string;
    amount:  number;
    phone_number : string;
    provider : string;
  };

  const insertDepositRequest = async (depositRequest: DepositRequest) => {
    try {
      const { data, error } = await supabase
        .from('Deposit_Requests')
        .insert([depositRequest]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('User inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setDepositSaved(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted user data (optional) 
    } catch (error) {
      console.error('Error inserting user:', error);
      setDepositSaved(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  const insertWithdrawalRequest = async (withdrawalRequest: WithdrawalRequest) => {
    try {
      const { data, error } = await supabase
        .from('Withdrawal_Requests')
        .insert([withdrawalRequest]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('User inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setWithdrawalSaved(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted user data (optional) 
    } catch (error) {
      console.error('Error inserting user:', error);
      setWithdrawalSaved(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  const handleInsertDeposit = async () => {    
    setDepositSaved(false);

    if ( depositorName == "" || depositorName == null  || depositAmount == 0 || depositorPhoneNumber == "" || depositorPhoneNumber == null  ) {
      alert("Please fill in all of the details before sending your deposit!");
      return ;
    }

    const newDeposit: DepositRequest = {
      username : depositorName, 
      wallet_address : account?.address || "",
      amount: depositAmount,
      phone_number : depositorPhoneNumber,
      provider : (paymentChoice) ? "EcoCash" : "InnBucks" 
    };

    try {
      alert("Deposit Initiated!");
      const insertedDeposit = await insertDepositRequest(newDeposit);
      console.log('Deposit Request created:', insertedDeposit); // Optional
      // Handle successful insertion here (e.g., display a success message)
    } catch (error) {
      console.error('Error creating deposit request:', error);
      // Handle error here (e.g., display an error message to the user)
    }
    setDepositFunds(false);
  };

  const handleInsertWithdrawal = async () => {    
    setWithdrawalSaved(false);

    if (withdrawalName == "" || withdrawalName == null  || withdrawalAmount == 0 || withdrawalPhoneNumber == "" || withdrawalPhoneNumber == null  ) {
      alert("Please fill in all of the details before sending your deposit!");
      return ;
    }

    const newWithdrawal: WithdrawalRequest = {
      username : withdrawalName, 
      wallet_address : account?.address || "",
      amount: withdrawalAmount,
      phone_number : withdrawalPhoneNumber,
      provider : (withdrawalChoice) ? "EcoCash" : "InnBucks" 
    };

    const transaction = prepareContractCall({
      contract: USDC_CONTRACT_RETRIEVED,
      method: "function transfer(address to, uint256 value)",
      params: ["0xD15BE984F5e58358b905B19e8fdAFced86954970", BigInt(withdrawalAmount * (10 ** 6))],
    });
    
    const result = await sendTx(transaction);

    try {
      alert("Withdrawal Initiated!");
      const insertedWithdrawal = await insertWithdrawalRequest(newWithdrawal);
      console.log('Withdrawal Request created:', insertedWithdrawal); // Optional
      // Handle successful insertion here (e.g., display a success message)
    } catch (error) {
      console.error('Error creating deposit request:', error);
      // Handle error here (e.g., display an error message to the user)
    }
    setWithdrawFunds(false);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("cloud_name", "samespaces");
    formData.append("upload_preset", "default-preset");
  
    try {
      // const response = await Cloudinary.v2.uploader.upload(formData, {
      //   upload_preset: 'your_upload_preset' // Replace with your preset name
      // });

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/samespaces/image/upload",
        {
          method: "post",
          body: formData
        }
      )

      const imageData = await response.json();
      const imageUrl = imageData.url.toString();
      console.log(imageData);
      console.log(imageUrl);
      setIdUrl(imageUrl);
  
      return imageUrl // Returns the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleFileChange = (event: any) => {
    // Handle file selection and upload logic here
    const file = event.target.files[0];
    console.log(file);
    uploadImage(file);
    // ...
  }

  const insertUser = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user]);
  
      if (error) {
        throw error;
      }
      // data: Object is possibly 'null'.
      // console.log('User inserted successfully:', data?.[0]); // This is for debugging purposes, remove in production
      setSaved(true);
      let proxyData = ["data"]
      if (data)
        proxyData = data;
      return proxyData?.[0]; // Return the inserted user data (optional) 
    } catch (error) {
      console.error('Error inserting user:', error);
      setSaved(true);
      throw error; // Re-throw the error for handling in the calling component
    }
  };

  const handleInsertUser = async () => {    
    const goals = `[\'Emergency Fund\'${(goalTwo == true) ? ", \'Electornics\'" : ""}${(goalThree == true) ? ", \'Car\'" : ""}${(goalFour == true) ? ", \'House\'" : ""}${(goalFive == true) ? ", \'Retirement\'" : ""}${(goalSix == true) ? ", \'Financial Freedom\'" : ""}]`;

    setSaved(false);

    const newUser: User = {
      name: firstName,
      surname: lastName,
      email: searchParams.get("email"),
      age:  age,
      phone_number : phoneNumber, 
      home_address : address, 
      city : city, 
      country : country,
      wallet_address : searchParams.get("wallet_address"),
      saving_objectives : goals,
    };

    try {
      const insertedUser = await insertUser(newUser);
      console.log('User created:', insertedUser); // Optional
      // Handle successful insertion here (e.g., display a success message)
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error here (e.g., display an error message to the user)
    }
  };

  type RowObj = {
    name: string[];
    artworks: number; 
    value: number;
    rating: number; 
  };

  let portfolioDataset: RowObj[] = [];

  const portfolioData: RowObj[] = [
    {
      name: ["USDc Cash", USDC.src],
      artworks : 9821,
      value: 0,
      rating:97
    },
    {
      name: ["S&P 500", SPY.src],
      artworks : 7032,
      value: 1,
      rating:87
    }
  ];

  const getPrice = async (stockTicker: string) => {
    if (!stockTicker) return;

    let stockPrice = 1;

    const url = 'https://cors-anywhere-4wlo.onrender.com/https://app.tiingo.com/asset/assetdetails?assetTicker=' + stockTicker;

    // Fetch AI response from the API
    const res = await fetch( url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.NEXT_PUBLIC_TIINGO_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await res.json();
    // alert(JSON.stringify(data));
    // console.log("Get Stock: ")
    // console.log(data);
    stockPrice = data.data.priceData.close; // Extract the price response
    // alert(stockPrice);
    setStockClosePrice(stockPrice);
    return stockPrice;
  };

  const handlePortfolioValue = (name: string, value: number) => {
    if (name == "USDc Cash") {
      return blncOfERC20USDC;
    }
  }

  const processPortfolioData = () => {
    // let spyPrice = 0;
    // getPrice("SPY").then(
    //   (res) => {
    //     spyPrice = res;
    //   }
    // );

    if (blncOfERC20 > 0) {
      portfolioDataset.push({
        name: ["USDC Cash", USDC.src],
        artworks : 1,
        value: Number(toEther(blncOfERC20USDC * BigInt(10**12))),
        rating:50
      })
    }

    if (blncOfERC20 > 0) {
      portfolioDataset.push({
        name: ["S&P 500", SPY.src],
        artworks : stockClosePrice,
        value: Number(Number(toEther(blncOfERC20)).toFixed(4)) * stockClosePrice,
        rating:50
      })
    }

    return portfolioDataset;
  }

  useEffect(() => {

    switchChain(base)

    const email = searchParams.get("email");
    const wallet_address = searchParams.get("wallet_address");

    // setShowModal(true);


    const fetchUserData = async () => {
      // const acc_address = await client?.account.address;
      // const user_email = await user?.email;

      const {data, error} = await supabase.from('users').select().eq('email', email);
      if (error) { 
        setFetchError("Couldn't fetch user!");
        console.log("Error: ");
        console.log(error);
      }

      if (data) {
        const userProfile = data?.[0];

        localStorage.setItem(
          'userProfile',
          JSON.stringify(userProfile),
        )

        setUserData(data);
        setFetchError(null);
        console.log("Data: ");
        console.log(data);
        if (data.length == 0) {
          setShowModal(true);
        }
      }
    }
    
    if (email && wallet_address) {
      fetchUserData();
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      // alert(JSON.stringify(userData));
    } else {
      // redirect('/');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      // alert(JSON.stringify(userData));
    }

    const fetchTrnasactions = async () => {
      // Address we want get transfers from
      const toAddress = walletAddress;

      const res = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: toAddress,
        excludeZeroValue: true,
        category: [AssetTransfersCategory.ERC20],
      });

      const transfers = res.transfers;
      setTransferTransactions(transfers);

      // Create a new array with the last 10 transfers in reverse order
      const last10Transfers: TransactionRowObj[] = transfers
        .slice(-10) // Get the last 10 transfers
        .reverse() // Reverse the order
        .map(transfer => {
          return {
            action: transfer.to === toAddress ? "Sold" :"Bought",
            asset: transfer.asset,
            value: transfer.value,
          };
        });
  
      setTransactionHistory(last10Transfers);
      console.log("Last 10 Transfers:", last10Transfers);
    }

    if (walletAddress)
      fetchTrnasactions();

    getPrice("SPY");

    const fetchStockPrices = () => {
      console.log("Function called every 5 seconds");
      // Your function logic goes here, e.g., fetching data, updating state, etc.
      getPrice("SPY");
      console.log(stockClosePrice)
    };

    // Set up the interval to call the function every 5 seconds (5000 milliseconds)
    const intervalId = setInterval(fetchStockPrices, 5000);

    // Clean up the interval when the component unmounts or the effect is cleaned up
    return () => {
      clearInterval(intervalId);
    };
    
  },[])


  const btnRef = React.useRef();

  const chatContainerRef = React.useRef(null);

  let aiDialog = [
    "Hi, how can I help you today?",      // External
  ];

  interface ChatBubbleProps {
    message: string;  // Define message as a string
    fromClient: boolean;  // Define fromClient as a boolean
  }

  const [userMessage, setUserMessage] = useState(null);

  const [chat, setChat] = useState([
    "Hi, how can I help you today?",      // External
  ]);

  const geminiCall = async (message: string) => {
    if (!message) return;

    const promptPrefix = "When responding to the query at the end, please focus on providing clear, factual, and detailed guidance on how to correctly use the features on the 54 platform. Do not offer financial advice or personal recommendations. Your responses should help users understand how to set their financial goals, invest in the S&P 500, save in US dollars, and earn a yield through the platform. Always direct users to the appropriate tools and features within the site, ensuring they understand the steps required to use them effectively. ";

    // Simulate adding a user message to the chat
    const newChat = [...chat, message];
    setChat(newChat);

    // Fetch AI response from the API
    const res = await fetch('https://cors-anywhere-4wlo.onrender.com/https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.NEXT_PUBLIC_GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        "contents": [
          {
            "parts": [{ "text": promptPrefix + message }]
          }
        ]
      }),
    });

    const data = await res.json();
    const contentText = data.candidates[0].content.parts[0].text; // Extract the AI response text

    // Update chat with the AI response
    setChat((prevChat) => [...prevChat, contentText]);
  };


  // const ChatBubble = ({ message, fromClient }) => {
    const ChatBubble: React.FC<ChatBubbleProps> = ({ message, fromClient }) => {
      return (
        <HStack
          spacing={4}
          justify={fromClient ? 'flex-end' : 'flex-start'}
          mb={4}
        >
          <Box
            bg={fromClient ? 'blue.500' : 'gray.300'}
            color={fromClient ? 'white' : 'black'}
            p={4}
            borderRadius="lg"
            maxW="80%"
            boxShadow="md"
            textAlign="left"
          >
            <Text>{message}</Text>
          </Box>
        </HStack>
      );
    };

  return (
    <>
      <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics 
              growth="+0%" 
              name="Cash Balance" 
              value={(walletAddress && blncOfERC20USDC) ? 
                `$${toEther(blncOfERC20USDC * BigInt(10**12))}` : 
                "$0.00"}  
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
                  }
                />
              }
              name="Total Invested"
              value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
              // value="$0"   
            />
            <Link
              onClick={()=>{setClaimTokens(!claimTokens)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg={boxBg}
                    icon={
                      <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name="Quick Invests in S&P500 stocks."
                value="Quick Invest"
              />
            </Link>
            <Link
              onClick={()=>{setSellAssets(!sellAssets)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="56px"
                    h="56px"
                    bg={boxBg}
                    icon={
                      <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name="Sell Stocks, ETFs & Crypto"
                value="Sell Assets"
              />
            </Link>
            <Link
              onClick={()=>{setDepositFunds(!depositFunds)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="65px"
                    h="65px"
                    bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                    icon={<Icon w="32px" h="32px" as={MdPayment} color="white" />}
                  />
                }
                name="Deposit Cash Funds"
                value="Deposit"
              />
            </Link>
            <Link
              onClick={()=>{setWithdrawFunds(!withdrawFunds)}}
            >
              <MiniStatistics
                startContent={
                  <IconBox
                    w="65px"
                    h="65px"
                    bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                    icon={<Icon w="32px" h="32px" as={MdRedeem} color="white" />}
                  />
                }
                name="Withdraw Cash Funds"
                value="Withdraw"
              />
            </Link>
          </SimpleGrid>

        {/* Main Fields */}
    
        <Flex width="100vw" height="100vh">
      {/* Left Section: Existing Chat Code */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        p={4}
        maxW="50%" // Occupy half of the horizontal space
        borderRight="1px solid"
        borderColor="gray.200"
      >
        {/* Chat Messages */}
        <VStack
          spacing={4}
          align="stretch"
          flex="1" // Take up remaining space
          maxH="550px"
          overflowY="auto"
          pr={2}
        >
          {chat.map((message: string, index) => {
            const fromClient: boolean = index % 2 !== 0;
            return <ChatBubble key={index} message={message} fromClient={fromClient} />;
          })}
        </VStack>

        {/* Input and Button */}
        <Flex align="center" mt={4} p={4} bg="gray.100" borderRadius="md">
          <Input
            placeholder="Type your message..."
            flex="1"
            mr={2}
            bg="white"
            onChange={(e) => { setUserMessage(e.target.value); }}
          />
          <Button px={6} colorScheme="brand" onClick={() => { geminiCall(userMessage); }}>
            Send
          </Button>
        </Flex>
      </Box>

      {/* Left Section: Placeholder for New Content */}
      <Box
        flex="1"
        p={4}
        maxW="50%" // Occupy the other half of the horizontal space
        bg="gray.50"
      >
        <Box textAlign="center" fontSize="xl" fontWeight="bold" color="gray.500">
          
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />

        <br/>

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />
          
        
          <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />

        <br/>


<MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />

        <br/>


<MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />

<br/>

<MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Invested"
          value={"$" + walletAddress && blncOfERC20 ? Number(toEther(blncOfERC20)).toFixed(4) : "0"} 
          // value="$0"   
        />

        </Box>
      </Box>
    </Flex>
                
      </Box>

      {
        showModal 
        &&
        <Modal size="lg" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
            {(activeStep == 1) && <ModalHeader>Personal Details</ModalHeader>}
            {(activeStep == 2) && <ModalHeader>Select your top financial goals</ModalHeader>}
            <ModalCloseButton />
            <ModalBody>
              { 
                (activeStep == 1)
                &&
                <>
                  <SimpleGrid columns={2} spacing={10}>
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input placeholder='First Name' value={firstName} onChange={(event)=>{setFirstName(event.target.value)}}/>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input placeholder='Last Name' value={lastName} onChange={(event)=>{setLastName(event.target.value)}}/>
                    </FormControl>
                  </SimpleGrid>
                  <SimpleGrid columns={2} spacing={10}>
                    <FormControl isRequired>
                      <FormLabel>Age</FormLabel>
                      <NumberInput defaultValue={18} min={1} max={100}  value={age} onChange={(event)=>{setAge(Number(event))}}>
                        <NumberInputField/>
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input placeholder='Phone Number' type="tel" value={phoneNumber} onChange={(event)=>{setPhoneNumber(event.target.value)}}/>
                    </FormControl>
                  </SimpleGrid>              
                  <div style={{paddingTop:"10px"}}>
                    <FormControl isRequired>
                      <FormLabel>Address</FormLabel>
                      <Input placeholder='Address'  value={address} onChange={(event)=>{setAddress(event.target.value)}}/>
                    </FormControl>
                  </div>
                  <SimpleGrid columns={2} spacing={10} paddingBottom="20px" paddingTop="10px">
                    <FormControl isRequired>
                      <FormLabel>City</FormLabel>
                      <Input placeholder='City'  value={city} onChange={(event)=>{setCity(event.target.value)}}/>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Country</FormLabel>
                      <Input placeholder='Zimbabwe' value={country} onChange={(event)=>{setCountry(event.target.value)}}/>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Upload a picture of your photo id</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiUploadCloud color="gray.300" />
                        </InputLeftElement>
                        <Input type="file" onChange={handleFileChange} />
                      </InputGroup>
                    </FormControl>
                  </SimpleGrid>
                </>
              }
              {
                (activeStep == 2)
                &&
                <SimpleGrid columns={2} spacing={3} paddingBottom="10px">
                  <Box position="relative" cursor="pointer">
                    <Image src={goal1.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalOne) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalOne(!goalOne)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Emergency <br/> Fund
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal2.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalTwo) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalTwo(!goalTwo)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Electornics
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal3.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalThree) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalThree(!goalThree)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Car
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal4.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalFour) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalFour(!goalFour)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Home
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal5.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalFive) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalFive(!goalFive)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Retirement
                      </Text>
                    </Box>
                  </Box>
                  <Box position="relative" cursor="pointer">
                    <Image src={goal6.src}  borderRadius="20px" alt="" />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      borderRadius="20px"
                      bg={(goalSix) ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.3)"}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      onClick={()=>{setGoalSix(!goalSix)}}
                    >
                      <Text color="white" fontSize="xl" fontWeight="bold">
                        Financial <br/> Freedom
                      </Text>
                    </Box>
                  </Box>
                </SimpleGrid>
              }
              {
                (activeStep == 3)
                &&
                <Box display="flex" justifyContent="center" alignItems="center" width="full" height="full">
                  <Image src={loading.src}  borderRadius="20px" alt="" />
                </Box>
              }
              { 
                (activeStep == 1) && 
                (
                  (firstName == "" || lastName == "" || phoneNumber == "" || address == "" || city == "" || country == "")
                  ?
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={() =>
                        toast({
                          title: 'Personal Details.',
                          description: "Please fill in all of your details!",
                          status: 'error',
                          duration: 9000,
                          isClosable: true,
                        })
                      }
                    >
                      Next
                    </Button>
                  :
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={()=>{ setActiveStep(activeStep + 1)}}
                    >
                      Next
                    </Button>
                )
              }
              {
                (activeStep == 2)
                &&
                <Button
                  fontSize="sm"
                  variant="brand"
                  fontWeight="500"
                  w="100%"
                  h="50"
                  onClick={()=>{ setActiveStep(activeStep + 1), handleInsertUser()}}
                >
                  Next
                </Button>
              }
              {
                (activeStep == 3)
                &&
                (
                  (saved)
                  ?
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                      onClick={onClose}
                    >
                      Finish
                    </Button>
                  :
                    <Button
                      fontSize="sm"
                      variant="brand"
                      fontWeight="500"
                      w="100%"
                      h="50"
                    >
                      Processing
                    </Button>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Stepper index={activeStep} style={{width:"100%"}} colorScheme='brand' >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink='0'>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
      <Modal size="lg" isOpen={sellAssets} onClose={()=>setSellAssets(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Sell Stocks, Assets and ETFs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SellAssets image={undefined} name={''} author={''} bidders={[]} download={''} currentbid={''}/>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal size="lg" isOpen={depositFunds} onClose={()=>setDepositFunds(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Deposit Funds into your Wallet</ModalHeader>
          <ModalHeader>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={()=>{setPaymentChoice(true)}}>EcoCash</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={()=>{setPaymentChoice(false)}}>InnBucks</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb> 
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            { 
              (paymentChoice)
              ?
                <>
                  <AspectRatio ratio={7 / 5}>
                    <Image src={mobilemoney.src} w={'100%'} borderRadius="20px" alt="" />
                  </AspectRatio>

                  <br/>

                  <p>Send your deposit to +263773712994 on EcoCash USD or InnBucks USD and confirm it here on this form!</p>

                  <br/>

                  <p>Amount to Deposit</p>

                  <Stack spacing={3}>

                    <NumberInput 
                      defaultValue={1} 
                      min={1} 
                      max={1000} 
                      // onChange={(event)=>{}}
                      // onChange={(e) => setDepositAmount(e.target.value)} 
                      onChange={(valueString, valueNumber) => setDepositAmount(valueNumber)}  
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    <Input placeholder="full name" borderRadius="16px" onChange={(e) => setDepositorName(e.target.value)} />

                    <InputGroup>
                      <InputLeftAddon children="+263" borderRadius="16px" />
                      <Input type="tel" placeholder="phone number" borderRadius="16px" onChange={(e) => setDepositorPhoneNumber(e.target.value)} />
                    </InputGroup>

                  </Stack>

                  <br/>

                  <Button
                    style={{
                      width:"100%", 
                      color:"white",
                      backgroundColor: "#4326ff"
                    }}
                    onClick={()=>{handleInsertDeposit()}}
                  > 
                    Deposit Funds
                  </Button>
                </>
              :
                <>
                  <AspectRatio ratio={7 / 5}>
                    <Image src={mobilemoney1.src} w={'100%'} borderRadius="20px" alt="" />
                  </AspectRatio>

                  <br/>

                  <p>Send your deposit to +263773712994 on EcoCash USD or InnBucks USD and confirm it here on this form!</p>

                  <br/>

                  <p>Amount to Deposit</p>

                  <Stack spacing={3}>

                    <NumberInput 
                      defaultValue={1} 
                      min={1} 
                      max={1000} 
                      // onChange={(event)=>{}}
                      // onChange={(e) => setDepositAmount(e.target.value)} 
                      onChange={(valueString, valueNumber) => setDepositAmount(valueNumber)}  
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    <Input placeholder="full name" borderRadius="16px" onChange={(e) => setDepositorName(e.target.value)} />

                    <InputGroup>
                      <InputLeftAddon children="+263" borderRadius="16px" />
                      <Input type="tel" placeholder="phone number" borderRadius="16px" onChange={(e) => setDepositorPhoneNumber(e.target.value)} />
                    </InputGroup>

                  </Stack>

                  <br/>

                  <Button
                    style={{
                      width:"100%", 
                      color:"white",
                      backgroundColor: "#4326ff"
                    }}
                    onClick={()=>{handleInsertDeposit()}}
                  > 
                    Deposit Funds
                  </Button>
                </>

            }
            

          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal size="lg" isOpen={withdrawFunds} onClose={()=>setWithdrawFunds(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Withdraw Funds from your Wallet</ModalHeader>
          <ModalHeader>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={()=>{setWithdrawalChoice(true)}}>EcoCash</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={()=>{setWithdrawalChoice(false)}}>InnBucks</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb> 
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AspectRatio ratio={7 / 5}>
              <Image src={(withdrawalChoice) ? mobilemoney.src : mobilemoney1.src} w={'100%'} borderRadius="20px" alt="" />
            </AspectRatio>

            <br/>

            <p>Initiate your withdrawal and confirm it here on this form!</p>

            <br/>

            <p>Amount to Withdraw</p>

            <Stack spacing={3}>
              <NumberInput 
                defaultValue={1} 
                min={1} 
                max={Math.floor(walletAddress && blncOfERC20USDC ? Number(toEther(blncOfERC20USDC * BigInt(10 ** 12))) : 0)} 
                value={withdrawalAmount} 
                onChange={(valueString, valueNumber) => setWithdrawalAmount(valueNumber)}
                isDisabled={Math.floor(walletAddress && blncOfERC20USDC ? Number(toEther(blncOfERC20USDC * BigInt(10 ** 12))) : 0) < 1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Input placeholder="full name" borderRadius="16px" onChange={(e) => setWithdrawalName(e.target.value)} />

              <InputGroup>
                <InputLeftAddon children="+263" borderRadius="16px" />
                <Input type="tel" placeholder="phone number" borderRadius="16px" onChange={(e) => setWithdrawalPhoneNumber(e.target.value)} />
              </InputGroup>
            </Stack>
            
            <br/>

            <Button
              style={{
                width:"100%", 
                color:"white",
                backgroundColor: "#4326ff"
              }}
              onClick={()=>{handleInsertWithdrawal()}}
            > 
              Withdraw Funds
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal size="lg" isOpen={claimTokens} onClose={()=>setClaimTokens(false)}>
        <ModalOverlay />
        <ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
          <ModalHeader>Quick Invest</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Quick Invest in S&P 500 index</p>
            <AspectRatio ratio={7 / 5}>
              <Image src={sandp.src} w={'100%'} borderRadius="20px" alt="" />
            </AspectRatio>

            <br/>

            <p>Amount to Invest</p>

            <NumberInput 
              defaultValue={1} 
              min={1} 
              max={Math.floor(walletAddress && blncOfERC20USDC ? Number(toEther(blncOfERC20USDC * BigInt(10 ** 12))) : 0)} 
              value={amountPaid} 
              onChange={(event)=>{setAmountPaid(Number(event))}} 
              isDisabled={Math.floor(walletAddress && blncOfERC20USDC ? Number(toEther(blncOfERC20USDC * BigInt(10 ** 12))) : 0) < 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <br/>
            <TransactionButton
              style={{
                width:"100%", 
                color:"white",
                backgroundColor: "#4326ff"
              }}
              transaction={()=> claimERC20({
                contract: tokenContractSPY,
                to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
                quantity: (amountPaid/stockClosePrice).toString()
              })}
              onError={async (e) => {
                alert("Quick Invest Error " + JSON.stringify(e.message))
              }}
              onTransactionSent={async () => {
                alert("Quick Invest Started")

                const transaction = prepareContractCall({
                  contract: USDC_CONTRACT_RETRIEVED,
                  method: "function transfer(address to, uint256 value)",
                  params: ["0xD15BE984F5e58358b905B19e8fdAFced86954970", BigInt(amountPaid * (10 ** 6))],
                });
                
                const result = await sendTx(transaction);
                console.log(result);
              }}
              onTransactionConfirmed={async (res) => {
                alert("Quick Invest Completed at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
              }}

            > 
              Quick Invest 
            </TransactionButton>
            <br/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
