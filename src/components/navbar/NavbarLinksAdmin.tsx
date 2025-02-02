'use client';

import React, { useState, useEffect } from 'react';

import { NextResponse } from 'next/server'

// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
  HStack,

  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from 'components/menu/ItemContent';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
// Assets
import avatar from '/public/img/avatars/avatar.png';
import navImage from '/public/img/layout/Navbar.png';
import { FaEthereum } from 'react-icons/fa';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline, MdNotificationsNone } from 'react-icons/md';
import routes from 'routes';
import { ThirdwebClient, createThirdwebClient } from 'thirdweb';
import { useActiveWalletConnectionStatus, UseConnectModalOptions, useConnectedWallets, useActiveWallet, useWalletDetailsModal } from "thirdweb/react";
// import { toEther, toWei, useAddress, useBalance, useContract, useContractRead, useContractWrite, useSDK, useTokenBalance } from "@thirdweb-dev/react";


export default function HeaderLinks(props: {
  secondary: boolean;
  onOpen: boolean | any;
  fixed: boolean | any;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  // const { clientAlchemy } = useSmartAccountClient({
  //   type: "MultiOwnerModularAccount",
  // });

  const wallets = useConnectedWallets();
  const wallet = useActiveWallet();
  
  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  })
  
  const { open } = useWalletDetailsModal();


  const [userMessage, setUserMessage] = useState(null);
  const [chat, setChat] = useState([
    "Hi, how can I help you today?",      // External
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const chatContainerRef = React.useRef(null);

  let aiDialog = [
    "Hi, how can I help you today?",      // External
  ];

  interface ChatBubbleProps {
    message: string;  // Define message as a string
    fromClient: boolean;  // Define fromClient as a boolean
  }

  function handleClick() {
    open({ client, theme: "light" });
  }
  
  function shortenAddress(address: string): string {
    if (!address) return "";
  
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
  
    return `${prefix}...${suffix}`;
  }

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

  useEffect(() => {
    // alert(JSON.stringify(wallets));
    
    // Scroll to the bottom of the chat container whenever new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

  
  },[chat])

  return (
    <>
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <Flex
        bg={ethBg}
        display={secondary ? 'flex' : 'none'}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex
          align="center"
          justify="center"
          bg={ethBox}
          h="29px"
          w="29px"
          borderRadius="30px"
          me="7px"
        >
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text
          w="max-content"
          color={ethColor}
          fontSize="sm"
          fontWeight="700"
          me="6px"
        >
          1,924
          <Text as="span" display={{ base: 'none', md: 'unset' }}>
            {' '}
            ETH
          </Text>
        </Text>
      </Flex>
      {/* <SidebarResponsive routes={routes} /> */}
      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: '30px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '450px' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Flex w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifications
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Mark all read
            </Text>
          </Flex>
          <Flex flexDirection="column">
            {/* <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon UI Dashboard PRO" />
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
              <ItemContent info="Horizon Design System Free" />
            </MenuItem> */}
          </Flex>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdInfoOutline}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        {/* <MenuList
          boxShadow={shadow}
          p="20px"
          me={{ base: '30px', md: 'unset' }}
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          minW={{ base: 'unset' }}
          maxW={{ base: '360px', md: 'unset' }}
        >
          <Image src={navImage.src} borderRadius="16px" mb="28px" alt="" />
          <Flex flexDirection="column">
            <Link w="100%" href="https://horizon-ui.com/pro">
              <Button w="100%" h="44px" mb="10px" variant="brand">
                Buy Horizon UI PRO
              </Button>
            </Link>
            <Link
              w="100%"
              href="https://horizon-ui.com/documentation/docs/introduction"
            >
              <Button
                w="100%"
                h="44px"
                mb="10px"
                border="1px solid"
                bg="transparent"
                borderColor={borderButton}
              >
                See Documentation
              </Button>
            </Link>
            <Link
              w="100%"
              href="https://github.com/horizon-ui/horizon-ui-chakra-nextjs"
            >
              <Button
                w="100%"
                h="44px"
                variant="no-hover"
                color={textColor}
                bg="transparent"
              >
                Try Horizon Free
              </Button>
            </Link>
          </Flex>
        </MenuList> */}
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}
          // onClick={handleClick}
        >
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius={'50%'}
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Image src={avatar.src} borderRadius="16px" mb="0px" alt="" />
          </Center>
        </MenuButton>
        {/* <button onClick={handleClick}> Show Wallet Details </button> */}
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
              onClick={handleClick}
            >
              Profile
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              onClick={handleClick}
            >
              {/* <Text fontSize="sm">Wallet Add: {user != null && shortenAddress(client?.account.address)}</Text>  */}
              <Text fontSize="sm">View Wallet</Text> 
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              onClick={onOpen}
            >
              <Text fontSize="sm">Ask 54</Text> 
            </MenuItem>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={() => window.location.href = "/"}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>

    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Ask 54</DrawerHeader>
        <DrawerBody
          height="80vh"  // Set the height to limit the visible area
          overflowY="scroll"  // Enable vertical scrolling when content overflows
          scrollBehavior="smooth"  // Smooth scroll when navigating
        >
          <Box
            ref={chatContainerRef}  // Reference to the chat container for scrolling
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            zIndex="0"
            p={4}
            maxW="600px"
            mx="auto"
          >
            <VStack spacing={4} align="stretch">
              {chat.map((message: string, index) => {
                const fromClient: boolean = index % 2 !== 0; // Odd-index = Client message
                return <ChatBubble key={index} message={message} fromClient={fromClient} />;
              })}
            </VStack>
          </Box>

        </DrawerBody>
        <DrawerFooter>
          <Input placeholder="Type here..." onChange={(e) => {setUserMessage(e.target.value)}}/> <br/>

          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={()=> {geminiCall(userMessage)}}> Send </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </>
  );
}
