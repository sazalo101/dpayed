import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  CreditCard as CardIcon,
  CalendarToday as CalendarIcon,
  Label as LabelIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const API_URL = 'http://localhost:5000';
const CONTRACT_ADDRESS = '0x6D56Fc93fB5169b164c0f6Dd0090ceE461FF9E5B';
const CONTRACT_ABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "CardCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsDeposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "stripeCustomerId",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "cancelCard",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isRegistered",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "stripeCustomerId",
						"type": "string"
					},
					{
						"components": [
							{
								"internalType": "string",
								"name": "cardTokenId",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "cardType",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "lastFour",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "expiration",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "isActive",
								"type": "bool"
							}
						],
						"internalType": "struct DPayCard.CardDetails",
						"name": "card",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					}
				],
				"internalType": "struct DPayCard.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "stripeCustomerId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cardTokenId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cardType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "lastFour",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "expiration",
				"type": "uint256"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "stripeCustomerId",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "cardTokenId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "cardType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "lastFour",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "expiration",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct DPayCard.CardDetails",
				"name": "card",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
export default function DPayApp() {
  const [account, setAccount] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  useEffect(() => {
    if (account) {
      fetchUserDetails();
      const interval = setInterval(fetchUserDetails, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [account]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
        });

        const balance = await provider.getBalance(accounts[0]);
        setEthBalance(ethers.utils.formatEther(balance));
        setError('');
      } else {
        setError('Please install MetaMask!');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const createVirtualCard = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      // Create card with Stripe
      const stripeResponse = await axios.post(`${API_URL}/api/register-card`, {
        address: account
      });
      
      // Register on smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.registerUser(
        stripeResponse.data.customerId,
        stripeResponse.data.cardTokenId,
        stripeResponse.data.cardType,
        stripeResponse.data.last4,
        stripeResponse.data.unixExpiration
      );
      
      await tx.wait();
      
      setSuccessMessage('Virtual card created successfully!');
      await fetchUserDetails();
    } catch (err) {
      console.error('Error creating card:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create virtual card');
    } finally {
      setLoading(false);
    }
  };

  const cancelCard = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      // Cancel on Stripe
      await axios.post(`${API_URL}/api/cancel-card`, {
        cardId: userDetails.card.cardTokenId
      });
      
      // Update smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.cancelCard();
      await tx.wait();
      
      setSuccessMessage('Card cancelled successfully');
      await fetchUserDetails();
    } catch (err) {
      console.error('Error cancelling card:', err);
      setError(err.response?.data?.error || err.message || 'Failed to cancel card');
    } finally {
      setLoading(false);
    }
  };

  const deposit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const amount = ethers.utils.parseEther(depositAmount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.deposit({ value: amount });
      await tx.wait();

      setSuccessMessage(`Successfully deposited ${depositAmount} ETH`);
      setDepositAmount('');
      setIsDepositDialogOpen(false);
      await fetchUserDetails();
    } catch (err) {
      console.error('Error depositing:', err);
      setError(err.message || 'Failed to deposit funds');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    if (!account) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const details = await contract.getUserDetails();
      const balance = await provider.getBalance(account);
      
      setEthBalance(ethers.utils.formatEther(balance));
      setUserDetails({
        isRegistered: details.isRegistered,
        stripeCustomerId: details.stripeCustomerId,
        balance: ethers.utils.formatEther(details.balance),
        card: {
          cardTokenId: details.card.cardTokenId,
          cardType: details.card.cardType,
          lastFour: details.card.lastFour,
          expiration: Number(details.card.expiration),
          isActive: details.card.isActive
        },
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch user details: ' + err.message);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {!account ? (
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome to DPay
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Connect your wallet to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<WalletIcon />}
                onClick={connectWallet}
                disabled={loading}
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="subtitle1">
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">
                      Balance: {parseFloat(ethBalance).toFixed(4)} ETH
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {userDetails?.isRegistered ? (
              <>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #283593 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 3 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="h4">Virtual Card</Typography>
                          </Grid>
                          <Grid item>
                            <Chip 
                              label={userDetails.card.isActive ? "Active" : "Cancelled"}
                              color={userDetails.card.isActive ? "success" : "error"}
                              sx={{ bgcolor: userDetails.card.isActive ? '#4caf50' : '#f44336' }}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                          <List>
                            <ListItem>
                              <ListItemIcon sx={{ color: 'white' }}>
                                <CardIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Card Number"
                                secondary={`•••• •••• •••• ${userDetails.card.lastFour}`}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon sx={{ color: 'white' }}>
                                <CalendarIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Expiration Date"
                                secondary={formatDate(userDetails.card.expiration)}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon sx={{ color: 'white' }}>
                                <LabelIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Card Type"
                                secondary={userDetails.card.cardType.toUpperCase()}
                                secondaryTypographyProps={{ color: 'white' }}
                              />
                            </ListItem>
                          </List>
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="h6">Card Balance</Typography>
                            <Typography variant="h3" sx={{ my: 2 }}>
                              {parseFloat(userDetails.balance).toFixed(4)} ETH
                            </Typography>
                            <Grid container spacing={2}>
                              {userDetails.card.isActive && (
                                <Grid item xs={12}>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={cancelCard}
                                    disabled={loading}
                                    fullWidth
                                  >
                                    Cancel Card
                                  </Button>
                                </Grid>
                              )}
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<BalanceIcon />}
                                  onClick={() => setIsDepositDialogOpen(true)}
                                  disabled={loading || !userDetails.card.isActive}
                                  fullWidth
                                >
                                  Deposit Funds
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Card sx={{ textAlign: 'center', p: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      No Card Registered
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={createVirtualCard}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Create Virtual Card'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        {/* Deposit Dialog */}
        <Dialog open={isDepositDialogOpen} onClose={() => setIsDepositDialogOpen(false)}>
          <DialogTitle>Deposit ETH to Card</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount (ETH)"
              type="number"
              fullWidth
              variant="outlined"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              inputProps={{ step: "0.01", min: "0" }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDepositDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={deposit}
              disabled={!depositAmount || loading}
              variant="contained"
            >
              {loading ? <CircularProgress size={24} /> : 'Deposit'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}