import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Button, Card, CardContent, Typography, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import styled, { keyframes } from 'styled-components';
import CardStorageABI from './CardStorageABI.json'; // ABI for smart contract

const CONTRACT_ADDRESS = '0xaAc56959eAa73f3f189f59a7354eb0CC62d418D4';

// Keyframe for background gradient animation
const animateBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for the background container
const StyledContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #141e30, #243b55);
  background-size: 400% 400%;
  animation: ${animateBg} 10s ease infinite;
  padding-top: 50px;
  padding-bottom: 50px;
`;

// Card Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled card with sleek dark theme
const StyledCard = styled(Card)`
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(145deg, #333333, #1a1a1a);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  width: 350px;
  margin: 20px auto;
  color: #fff;
  padding: 20px;
`;

// Custom Button with hover effect
const StyledButton = styled(Button)`
  background-color: #3a3a3a;
  color: #fff;
  margin-top: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #575757;
  }
`;

// Dark theme customization for MUI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9e9e9e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      color: '#fff',
      marginBottom: '20px',
      fontWeight: 600,
    },
    body1: {
      color: '#9e9e9e',
    },
  },
});

function App() {
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
  const [error, setError] = useState('');
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Function to connect to Metamask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CardStorageABI, newProvider.getSigner());
        setContract(newContract);
        const balance = await newProvider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      } else {
        setError('Please install Metamask');
      }
    } catch (err) {
      setError('Failed to connect to wallet');
    }
  };

  // Function to register the card via backend API and store it on-chain
  const registerCard = async () => {
    try {
      // Call the backend to generate the card
      const response = await axios.post('https://dpay-back.onrender.com/api/register-card', { address: userAddress });
      setCardDetails(response.data);

      // Store card on-chain
      const tx = await contract.registerCard(
        response.data.cardTokenId,
        response.data.last4,
        response.data.expMonth,
        response.data.expYear,
        response.data.status
      );
      await tx.wait();

      setError('');
    } catch (err) {
      setError('Failed to register card. ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledContainer maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Connect Wallet & Register Card
        </Typography>

        {!userAddress && (
          <StyledButton variant="contained" onClick={connectWallet} startIcon={<AccountBalanceWalletIcon />}>
            Connect Metamask (Arbitrum Sepolia)
          </StyledButton>
        )}

        {userAddress && (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Connected Address:</strong> {userAddress}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Balance:</strong> {balance} ETH
            </Typography>

            <StyledButton variant="contained" onClick={registerCard}>
              Register Card
            </StyledButton>
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}

        {cardDetails && (
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Virtual Debit Card
              </Typography>
              <Typography variant="body2">
                <strong>Cardholder ID:</strong> {cardDetails.customerId}
              </Typography>
              <Typography variant="body2">
                <strong>Last 4 digits:</strong> {cardDetails.last4}
              </Typography>
              <Typography variant="body2">
                <strong>Expiry:</strong> {cardDetails.expMonth}/{cardDetails.expYear}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {cardDetails.status}
              </Typography>
            </CardContent>
          </StyledCard>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App;
