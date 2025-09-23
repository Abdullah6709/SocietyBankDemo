import React, { useState, useEffect } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, AccountBalance, Receipt } from '@mui/icons-material';
import members from "../Member.json"

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Account List View Component
const AccountListView = ({ 
  accounts, 
  searchTerm, 
  setSearchTerm, 
  typeFilter, 
  setTypeFilter, 
  page, 
  setPage, 
  rowsPerPage, 
  setRowsPerPage
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Accounts"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              value={typeFilter}
              label="Account Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="savings">Savings</MenuItem>
              <MenuItem value="fd">Fixed Deposit</MenuItem>
              <MenuItem value="rd">Recurring Deposit</MenuItem>
              <MenuItem value="current">Current</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account ID</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Member Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account) => (
              <TableRow key={account.accountId}>
                <TableCell>{account.accountId}</TableCell>
                <TableCell>{account.memberId}</TableCell>
                <TableCell>{account.memberName}</TableCell>
                <TableCell>{account.mobile}</TableCell>
                <TableCell>
                  <Chip 
                    label={account.type.toUpperCase()} 
                    color={
                      account.type === 'savings' ? 'primary' : 
                      account.type === 'fd' ? 'secondary' : 
                      account.type === 'rd' ? 'info' : 'success'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>₹{account.balance.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={account.status} 
                    color={account.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={accounts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

// Transaction Component
const Transaction = ({ accounts, onAddTransaction }) => {
  const [transactionData, setTransactionData] = useState({
    accountId: '',
    type: 'credit', // credit or debit
    amount: '',
    description: ''
  });

  const handleSubmit = () => {
    onAddTransaction({
      ...transactionData,
      transactionId: `TXN-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    setTransactionData({
      accountId: '',
      type: 'credit',
      amount: '',
      description: ''
    });
  };

  const selectedAccount = accounts.find(acc => acc.accountId === transactionData.accountId);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transaction Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>New Transaction</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Account</InputLabel>
                <Select
                  value={transactionData.accountId}
                  label="Select Account"
                  onChange={(e) => setTransactionData({ ...transactionData, accountId: e.target.value })}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.accountId} value={account.accountId}>
                      {account.accountId} - {account.memberName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedAccount && (
                <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Current Balance:</strong> ₹{selectedAccount.balance.toLocaleString()}
                  </Typography>
                </Box>
              )}

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Transaction Type</Typography>
                <RadioGroup
                  value={transactionData.type}
                  onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value })}
                  row
                >
                  <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                  <FormControlLabel value="debit" control={<Radio />} label="Debit" />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={transactionData.amount}
                onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={transactionData.description}
                onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSubmit}
                disabled={!transactionData.accountId || !transactionData.amount}
              >
                Process Transaction
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
          {accounts.flatMap(acc => acc.transactions || [])
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map((transaction, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {transaction.accountId}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {transaction.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </Typography>
                    <Chip 
                      label={transaction.type.toUpperCase()} 
                      color={transaction.type === 'credit' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

// Main Component
const AccountManagementSystem = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [accounts, setAccounts] = useState([
    {
      accountId: "ACC-10001",
      memberId: "MSR-0001",
      memberName: "Satyam Ray",
      mobile: "+919810000001",
      type: "savings",
      balance: 12500.50,
      interestRate: 4.0,
      createdAt: "2025-01-15T10:00:00Z",
      status: "active",
      transactions: [
        {
          transactionId: "TXN-001",
          type: "credit",
          amount: 10000,
          description: "Initial deposit",
          timestamp: "2025-01-15T10:00:00Z"
        },
        {
          transactionId: "TXN-002",
          type: "credit",
          amount: 2500.50,
          description: "Monthly savings",
          timestamp: "2025-02-01T09:30:00Z"
        }
      ]
    },
    {
      accountId: "ACC-10002",
      memberId: "MSR-0002",
      memberName: "Ananya Singh",
      mobile: "+919810000002",
      type: "fd",
      balance: 50000.00,
      interestRate: 6.5,
      createdAt: "2025-02-20T14:30:00Z",
      status: "active",
      transactions: [
        {
          transactionId: "TXN-003",
          type: "credit",
          amount: 50000,
          description: "Fixed deposit",
          timestamp: "2025-02-20T14:30:00Z"
        }
      ]
    },
    {
      accountId: "ACC-10003",
      memberId: "MSR-0003",
      memberName: "Rohit Sharma",
      mobile: "+919810000003",
      type: "rd",
      balance: 15000.00,
      interestRate: 5.5,
      createdAt: "2025-03-10T11:00:00Z",
      status: "active",
      transactions: [
        {
          transactionId: "TXN-004",
          type: "credit",
          amount: 5000,
          description: "Recurring deposit installment",
          timestamp: "2025-03-10T11:00:00Z"
        }
      ]
    },
    {
      accountId: "ACC-10004",
      memberId: "MSR-0004",
      memberName: "Priya Nair",
      mobile: "+919810000004",
      type: "current",
      balance: 75000.75,
      interestRate: 3.0,
      createdAt: "2025-04-05T16:45:00Z",
      status: "active",
      transactions: [
        {
          transactionId: "TXN-005",
          type: "credit",
          amount: 75000.75,
          description: "Business account opening",
          timestamp: "2025-04-05T16:45:00Z"
        }
      ]
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddTransaction = (transactionData) => {
    const updatedAccounts = accounts.map(account => {
      if (account.accountId === transactionData.accountId) {
        const newBalance = transactionData.type === 'credit' 
          ? account.balance + parseFloat(transactionData.amount)
          : account.balance - parseFloat(transactionData.amount);
        
        return {
          ...account,
          balance: newBalance,
          transactions: [...(account.transactions || []), transactionData]
        };
      }
      return account;
    });
    
    setAccounts(updatedAccounts);
    alert(`Transaction successful! Transaction ID: ${transactionData.transactionId}`);
  };

  // Filter accounts based on search term and type
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.mobile.includes(searchTerm);
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <StyledPaper>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Accounts" />
        <Tab label="Transactions" />
      </Tabs>

      {/* Tab 1: Accounts */}
      <TabPanel value={tabValue} index={0}>
        <AccountListView 
          accounts={filteredAccounts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </TabPanel>

      {/* Tab 2: Transactions */}
      <TabPanel value={tabValue} index={1}>
        <Transaction 
          accounts={accounts}
          onAddTransaction={handleAddTransaction}
        />
      </TabPanel>
    </StyledPaper>
  );
};

export default AccountManagementSystem;