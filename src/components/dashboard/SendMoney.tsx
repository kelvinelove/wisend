import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, DollarSign, Percent, TrendingUp, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchFXRates, calculateConversion } from '@/services/fxRates';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';

interface FXRates {
  USD_GBP: number;
  USD_ZAR: number;
  timestamp: number;
}

export const SendMoney: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState<'GBP' | 'ZAR'>('GBP');
  const [rates, setRates] = useState<FXRates | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const MIN_AMOUNT = 10;
  const MAX_AMOUNT = 5000;

  useEffect(() => {
    loadFXRates();
  }, []);

  const loadFXRates = async () => {
    setIsLoadingRates(true);
    try {
      const newRates = await fetchFXRates();
      setRates(newRates);
      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: "Failed to load exchange rates",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const getAmountValidation = () => {
    const numAmount = parseFloat(amount);
    if (!amount) return { isValid: false, message: '', type: 'neutral' };
    if (numAmount < MIN_AMOUNT) return { isValid: false, message: `Minimum amount is $${MIN_AMOUNT}`, type: 'error' };
    if (numAmount > MAX_AMOUNT) return { isValid: false, message: `Maximum amount is $${MAX_AMOUNT}`, type: 'error' };
    return { isValid: true, message: 'Amount is within limits', type: 'success' };
  };

  const handleSendMoney = async () => {
    const numAmount = parseFloat(amount);
    const validation = getAmountValidation();
    
    if (!validation.isValid) {
      toast({
        title: "Invalid Amount",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }

    if (!rates) {
      toast({
        title: "Exchange rates unavailable",
        description: "Please wait for rates to load.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save transaction to history
    const transaction = {
      id: Date.now().toString(),
      amount: numAmount,
      currency: targetCurrency,
      date: new Date().toISOString(),
      status: 'completed',
      userId: user?.id,
      ...calculateConversion(numAmount, targetCurrency, rates)
    };
    
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    existingTransactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    
    setIsSending(false);
    setAmount('');
    
    toast({
      title: "Money Sent Successfully!",
      description: `$${numAmount} has been sent. Your recipient will receive ${targetCurrency === 'GBP' ? '£' : 'R'}${transaction.totalReceived}.`,
    });
  };

  const calculation = rates && amount && parseFloat(amount) > 0 
    ? calculateConversion(parseFloat(amount), targetCurrency, rates)
    : null;

  const amountValidation = getAmountValidation();

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Send className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Send Money</CardTitle>
            <CardDescription>Transfer money to UK or South Africa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input with Real-time Validation */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to Send (USD)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              placeholder={`${MIN_AMOUNT} - ${MAX_AMOUNT}`}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`pl-10 ${amountValidation.type === 'error' ? 'border-destructive' : amountValidation.type === 'success' ? 'border-green-500' : ''}`}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
            />
            {amount && (
              <div className="absolute right-3 top-3">
                {amountValidation.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : amountValidation.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : null}
              </div>
            )}
          </div>
          {amount && (
            <div className={`text-sm ${amountValidation.type === 'error' ? 'text-destructive' : amountValidation.type === 'success' ? 'text-green-600' : 'text-muted-foreground'}`}>
              {amountValidation.message}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Minimum: ${MIN_AMOUNT} • Maximum: ${MAX_AMOUNT}
          </p>
        </div>

        {/* Destination Country with Enhanced Selection */}
        <div className="space-y-2">
          <Label htmlFor="currency">Destination</Label>
          <Select value={targetCurrency} onValueChange={(value: 'GBP' | 'ZAR') => setTargetCurrency(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GBP">
                <div className="flex items-center space-x-2">
                  <span>🇬🇧</span>
                  <div>
                    <div className="font-medium">United Kingdom (GBP)</div>
                    <div className="text-xs text-muted-foreground">10% fee • Faster transfers</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="ZAR">
                <div className="flex items-center space-x-2">
                  <span>🇿🇦</span>
                  <div>
                    <div className="font-medium">South Africa (ZAR)</div>
                    <div className="text-xs text-muted-foreground">20% fee • Standard transfers</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Exchange Rate Display with Last Updated */}
        {rates && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Exchange Rate</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rates are updated every 5 minutes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <div className="flex items-center space-x-2">
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={loadFXRates}
                  disabled={isLoadingRates}
                  className="text-primary hover:text-primary-glow text-xs"
                >
                  {isLoadingRates ? 'Updating...' : 'Refresh'}
                </button>
              </div>
            </div>
            <p className="font-medium">
              1 USD = {targetCurrency === 'GBP' 
                ? `£${rates.USD_GBP.toFixed(4)}` 
                : `R${rates.USD_ZAR.toFixed(2)}`
              }
            </p>
          </div>
        )}

        {/* Enhanced Calculation Breakdown */}
        {calculation && (
          <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Transaction Breakdown</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Fees vary by destination and payment method. Higher fees for ZAR transfers reflect additional processing costs and regulatory requirements.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount to send:</span>
                <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-warning">
                <span className="flex items-center space-x-1">
                  <Percent className="h-3 w-3" />
                  <span>Transaction fee ({calculation.feePercentage}%):</span>
                </span>
                <span className="font-medium">-${calculation.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Amount after fee:</span>
                <span>${(parseFloat(amount) - calculation.fee).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Recipient receives:</span>
                <span className="text-success">
                  {targetCurrency === 'GBP' ? '£' : 'R'}{calculation.totalReceived.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Send Button with Enhanced Validation */}
        <Button
          onClick={handleSendMoney}
          disabled={!amount || !rates || isSending || !amountValidation.isValid}
          className="w-full bg-gradient-secondary hover:opacity-90 transition-opacity"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Money...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Money
            </>
          )}
        </Button>

        {/* Fee Information Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Fee Structure:</strong> GBP transfers have a 10% fee for faster processing, while ZAR transfers have a 20% fee due to additional regulatory requirements. Fees are transparent and shown before confirmation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};