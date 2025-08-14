import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { History, ChevronLeft, ChevronRight, Send, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown, Filter, Search } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

interface Transaction {
  id: string;
  amount: number;
  currency: 'GBP' | 'ZAR';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  totalReceived: number;
  fee: number;
  userId?: string;
}

type SortField = 'date' | 'amount' | 'currency' | 'status';
type SortDirection = 'asc' | 'desc';

// Mock transaction data
const generateMockTransactions = (userId: string): Transaction[] => {
  const transactions: Transaction[] = [];
  const currencies: ('GBP' | 'ZAR')[] = ['GBP', 'ZAR'];
  const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'completed', 'completed', 'pending'];
  
  for (let i = 0; i < 20; i++) {
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = Math.floor(Math.random() * 1000) + 50;
    const fee = amount * (currency === 'GBP' ? 0.1 : 0.2);
    const exchangeRate = currency === 'GBP' ? 0.79 : 18.45;
    const totalReceived = (amount - fee) * exchangeRate;
    
    transactions.push({
      id: `tx_${Date.now()}_${i}`,
      amount,
      currency,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000 * Math.random() * 30).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      totalReceived: Math.round(totalReceived * 100) / 100,
      fee: Math.round(fee * 100) / 100,
      userId
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user) return;
    
    // Get transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // If no saved transactions, generate mock data
    if (savedTransactions.length === 0) {
      const mockTransactions = generateMockTransactions(user.id);
      localStorage.setItem('transactions', JSON.stringify(mockTransactions));
      setTransactions(mockTransactions);
    } else {
      // Filter transactions for current user
      const userTransactions = savedTransactions.filter((t: Transaction) => t.userId === user.id);
      setTransactions(userTransactions);
    }
  }, [user]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesCurrency = filterCurrency === 'all' || transaction.currency === filterCurrency;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.currency.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCurrency && matchesStatus && matchesSearch;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'currency':
          aValue = a.currency;
          bValue = b.currency;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, sortField, sortDirection, filterCurrency, filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetFilters = () => {
    setFilterCurrency('all');
    setFilterStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-accent rounded-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent money transfers</CardDescription>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedTransactions.length} transactions
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID, amount, or currency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <Label htmlFor="currency-filter" className="text-sm">Currency</Label>
                <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                  <SelectTrigger id="currency-filter" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter" className="text-sm">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {(filterCurrency !== 'all' || filterStatus !== 'all' || searchTerm) && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
              </span>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {filteredAndSortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
            </p>
            <p className="text-sm text-muted-foreground">
              {transactions.length === 0 ? 'Your transfer history will appear here' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <>
            {/* Sortable Headers */}
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Date</span>
                    {getSortIcon('date')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Amount</span>
                    {getSortIcon('amount')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('currency')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Currency</span>
                    {getSortIcon('currency')}
                  </button>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </button>
                </div>
                <div className="col-span-3 text-right">Recipient Amount</div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-full">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{formatDate(transaction.date)}</p>
                        <p className="text-xs text-muted-foreground">ID: {transaction.id.slice(-8)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Fee: ${transaction.fee.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <span>{transaction.currency === 'GBP' ? '🇬🇧' : '🇿🇦'}</span>
                      <span className="font-medium">{transaction.currency}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="font-medium">
                      {transaction.currency === 'GBP' ? '£' : 'R'}{transaction.totalReceived.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To {transaction.currency === 'GBP' ? 'UK' : 'South Africa'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length})
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};