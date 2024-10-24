import React from 'react';
import { 
  Box, 
  Typography,
  Button
} from '@mui/material';
import { AccountBalanceWallet, CreditCard } from '@mui/icons-material';
import { useWeb3 } from '../context/Web3Context';

export default function Header() {
  const { account, connectWallet } = useWeb3();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCard />
        DPay Virtual Card
      </Typography>
      
      {account ? (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWallet />
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </Typography>
      ) : (
        <Button
          variant="contained"
          onClick={connectWallet}
          startIcon={<AccountBalanceWallet />}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}