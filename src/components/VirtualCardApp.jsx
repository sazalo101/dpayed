import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Box 
} from '@mui/material';
import { useWeb3 } from '../context/Web3Context';
import Header from './Header';
import RegistrationForm from './RegistrationForm';
import CardManagement from './CardManagement';
import ErrorDisplay from './ErrorDisplay';

export default function VirtualCardApp() {
  const { account, contract, error: web3Error } = useWeb3();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkRegistration();
  }, [account, contract]);

  const checkRegistration = async () => {
    if (!account || !contract) return;
    
    try {
      const userData = await contract.users(account);
      setIsRegistered(userData.isRegistered);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Header />
        
        <Box sx={{ mt: 4 }}>
          {!isRegistered ? (
            <RegistrationForm 
              onRegistered={() => setIsRegistered(true)}
              setLoading={setLoading}
              setError={setError}
            />
          ) : (
            <CardManagement 
              setLoading={setLoading}
              setError={setError}
            />
          )}
        </Box>

        <ErrorDisplay error={error || web3Error} />
      </Paper>
    </Container>
  );
}