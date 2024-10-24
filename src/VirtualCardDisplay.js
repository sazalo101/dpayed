import React from 'react';
import { Card } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

const VirtualCardDisplay = ({ cardDetails, userDetails, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="animate-pulse bg-gray-200 rounded-lg h-56"></div>
      </div>
    );
  }

  if (!cardDetails?.cardTokenId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No card details available</AlertTitle>
        Please register to get your virtual card.
      </Alert>
    );
  }

  const formatExpiration = (timestamp) => {
    if (!timestamp) return 'MM/YY';
    const date = new Date(Number(timestamp) * 1000);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  const formatCardNumber = (lastFour) => {
    return `•••• •••• •••• ${lastFour || '****'}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-56 w-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
        <div className="absolute top-4 right-4">
          <Card className="w-12 h-12 text-white" />
        </div>
        
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-sm opacity-80">Virtual Card</p>
            <p className="font-mono text-xl tracking-wider">
              {formatCardNumber(cardDetails.lastFour)}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs opacity-80">CARD HOLDER</p>
                <p className="font-medium tracking-wider">
                  {userDetails?.name || 'AUTHORIZED USER'}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs opacity-80">EXPIRES</p>
                <p className="font-medium">
                  {formatExpiration(cardDetails.expiration)}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs opacity-80">CARD TYPE</p>
              <p className="font-medium tracking-wider">
                {cardDetails.cardType || 'VIRTUAL'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg shadow p-4 space-y-2">
        <h3 className="font-semibold text-lg">Card Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">
              {userDetails?.cardActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Monthly Limit</p>
            <p className="font-medium">
              {userDetails?.cardLimit || 0} ETH
            </p>
          </div>
          <div>
            <p className="text-gray-500">Spent This Month</p>
            <p className="font-medium">
              {userDetails?.spentAmount || 0} ETH
            </p>
          </div>
          <div>
            <p className="text-gray-500">Available Balance</p>
            <p className="font-medium">
              {userDetails?.balance || 0} ETH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCardDisplay;