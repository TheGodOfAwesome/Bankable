'use client';

import React, { useEffect, useState } from 'react';

import { createThirdwebClient, defineChain, getContract, toEther, getUser } from 'thirdweb';
import { ConnectButton, useActiveWalletConnectionStatus, useConnectModal, useActiveAccount, useSwitchActiveWalletChain, useReadContract, TransactionButton } from "thirdweb/react";
import { base, sepolia, baseSepolia, arbitrumSepolia} from "thirdweb/chains";
import { smartWallet } from "thirdweb/wallets";
import { claimTo as claimERC20, balanceOf as balanceOfERC20 } from "thirdweb/extensions/erc20";
import { claimTo as claimERC721, balanceOf as balanceOfERC721 } from "thirdweb/extensions/erc721";

// Chakra imports

import {
	Checkbox,
	Box,
	Button,
	Flex,
	Image,
	Input,
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

	Theme,
	useToast,
	Link,
	Grid,
	useEditable,
} from '@chakra-ui/react';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';

// Assets
import { MdCheckBox, MdDragIndicator } from 'react-icons/md';

import goal1 from '/public/img/goals/1.jpg';
import goal2 from '/public/img/goals/2.jpg';
import goal3 from '/public/img/goals/3.jpg';
import goal4 from '/public/img/goals/4.jpg';
import goal5 from '/public/img/goals/5.jpg';
import goal6 from '/public/img/goals/6.jpg';

export default function GoalTrackerLong(props: { [x: string]: any }) {
	const { ...rest } = props;

	const switchChain = useSwitchActiveWalletChain();

	const [addGoals, setAddGoals] = useState(false);

	const [goalOne, setGoalOne] = useState(false);
	const [goalTwo, setGoalTwo] = useState(false);
	const [goalThree, setGoalThree] = useState(false);
	const [goalFour, setGoalFour] = useState(false);
	const [goalFive, setGoalFive] = useState(false);
	const [goalSix, setGoalSix] = useState(false);

	const client3rdWeb = createThirdwebClient({
		clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
	});

	const account = useActiveAccount();
	const walletAddress = account?.address || "";

	// const chain = defineChain(baseSepolia);
	const GOAL1_CONTRACT = "0x916E080395884286Df55068Dd473201656bb9389";
	const GOAL2_CONTRACT = "0xC7339dA6357eB35f3340E95287C5c2E9046331A6";
	const GOAL3_CONTRACT = "0xF72FE6658bBa69E31Fe482d29063a0945e3Bbd8B";
	const GOAL4_CONTRACT = "0xEE019aA873630c9625f2Aa07993d7adCf6299155";
	const GOAL5_CONTRACT = "0x7843D74456C54088175AffB3dAf971D2c0baa87E";
	const GOAL6_CONTRACT = "0xcBB8C4110aAc4339e0868FD2B433D87aB9224aE1";

	const goalContract1 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL1_CONTRACT
	});
  
	const goalContract2 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL2_CONTRACT
	});
  
	const goalContract3 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL3_CONTRACT
	});
  
	const goalContract4 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL4_CONTRACT
	});
  
	const goalContract5 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL5_CONTRACT
	});
  
	const goalContract6 = getContract({
	  client: client3rdWeb,
	  chain: defineChain(baseSepolia),
	  address: GOAL6_CONTRACT
	});

	const {data: blncOfERC721a} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract1,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	const {data: blncOfERC721b} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract2,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	const {data: blncOfERC721c} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract3,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	const {data: blncOfERC721d} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract4,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	const {data: blncOfERC721e} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract5,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	const {data: blncOfERC721f} = useReadContract(
		balanceOfERC721,
		{
			contract: goalContract6,
			owner: walletAddress as `0x${string}` || ""  as `0x${string}`
		}
	);

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'navy.700');
	const brandColor = useColorModeValue('brand.500', 'brand.400');

	return (
		<>
			<Card 
				p='20px' 
				alignItems='center' 
				flexDirection='column' 
				w='100%' 
				{...rest}
				minH ={{ base: 'auto', lg: '365px', '2xl': '365px' }}
				height ="620px"
			>
				<Flex alignItems='center' w='100%' mb='30px'>
					<IconBox
						me='12px'
						w='38px'
						h='38px'
						bg={boxBg}
						icon={<Icon as={MdCheckBox} color={brandColor} w='24px' h='24px' />}
					/>

					<Text color={textColor} fontSize='lg' fontWeight='700'>
						Goal Tracker
					</Text>
					<Menu ms='auto' />

					<Button
						fontSize="sm"
						variant="brand"
						fontWeight="500"
						w="80px"
						h="30px"
						float="right"
						alignSelf="right"
						onClick={() => setAddGoals(!addGoals)}
					>
						+ ADD 
					</Button>
				</Flex>
				<Box px='11px' w='100%'>
					{
						blncOfERC721a >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme' />
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Emergency Fund  $1000
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
					
					{
						blncOfERC721b >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme'/>
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Electronics $1000
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
					
					{
						blncOfERC721c >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme' />
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Car $5000
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
					
					{
						blncOfERC721d >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme' />
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Home $20000
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
					
					{
						blncOfERC721e >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme' />
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Retirement $50000
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
					
					{
						blncOfERC721f >= BigInt(1) 
						&&
						<Flex w='100%' mb='20px'>
							<Checkbox me='16px' colorScheme='brandScheme' />
							<Text fontWeight='bold' color={textColor} fontSize='md' textAlign='start'>
								Financial Freedom $100000 
							</Text>
							<Icon ms='auto' as={MdDragIndicator} color='secondaryGray.600' w='24px' h='24px' />
						</Flex>
					}
				</Box>
			</Card>
			
			<Modal size="lg" isOpen={addGoals} onClose={()=>setAddGoals(false)}>
				<ModalOverlay />
				<ModalContent  style={{ width:"600px", maxWidth:"98vw"}}>
					<ModalHeader>Your Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<>
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
							// onClick={()=>{setGoalOne(!goalOne)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Emergency <br/> Fund
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract1,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Emergency Fund
							</TransactionButton>
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
							// onClick={()=>{setGoalTwo(!goalTwo)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Electornics
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract2,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Electronics
							</TransactionButton>
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
							// onClick={()=>{setGoalThree(!goalThree)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Car
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract3,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Car
							</TransactionButton>
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
							// onClick={()=>{setGoalFour(!goalFour)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Home
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract4,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Home
							</TransactionButton>
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
							// onClick={()=>{setGoalFive(!goalFive)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Retirement
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract5,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Retirement
							</TransactionButton>
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
							// onClick={()=>{setGoalSix(!goalSix)}}
							>
							{/* <Text color="white" fontSize="xl" fontWeight="bold">
								Financial <br/> Freedom
							</Text> */}
							<TransactionButton
								style={{
								width:"100%", 
								color:"white",
								backgroundColor: "transparent",
								fontSize:"xl",
								fontWeight:"bold"
								}}
								transaction={()=> claimERC721({
								contract: goalContract6,
								to:  walletAddress as `0x${string}` || ""  as `0x${string}`,
								quantity: BigInt(1)
								})}
								onError={async (e) => {
								alert("Select Goal Error" + JSON.stringify(e.message))
								}}
								onTransactionSent={async () => {
								alert("Goal Selected")
								}}
								onTransactionConfirmed={async (res) => {
								alert("Goal Selected at " + res.transactionHash + " to see more visit " + "https://sepolia.basescan.org/tx/" + res.transactionHash)
    							switchChain(base)
								}}

							> 
								Financial Freedom
							</TransactionButton>
							</Box>
						</Box>
						</SimpleGrid>
						</>
					</ModalBody>
					<ModalFooter>
						<Button
						fontSize="sm"
						variant="brand"
						fontWeight="500"
						disabled={true}
						w="100%"
						h="50"
						onClick={()=>{ setAddGoals(false)}}
						>
						Close
						</Button>
					</ModalFooter>
					</ModalContent>
				</Modal>
		</>
	);
}
