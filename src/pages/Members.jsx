// src/pages/Members.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  AccountBalance,
  Savings,
  TrendingUp,
  PersonAdd
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...(status === 'Active' && {
    background: 'linear-gradient(135deg, #4caf50, #45a049)',
    color: 'white'
  }),
  ...(status === 'Inactive' && {
    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
    color: 'white'
  }),
  ...(status === 'Suspended' && {
    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
    color: 'white'
  })
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: 'rgba(102, 126, 234, 0.1)',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.2)',
  }
}));

// Sample Data
const membersData = [
  {
    id: 'M001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@email.com',
    phone: '+91 98765 43210',
    joinDate: '2023-01-15',
    status: 'Active',
    savings: '₹ 1,25,000',
    loans: '₹ 2,50,000',
    avatar: 'RK',
    lastActive: '2024-01-15'
  },
  {
    id: 'M002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43211',
    joinDate: '2023-02-20',
    status: 'Active',
    savings: '₹ 85,000',
    loans: '₹ 1,20,000',
    avatar: 'PS',
    lastActive: '2024-01-14'
  },
  {
    id: 'M003',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 98765 43212',
    joinDate: '2023-03-10',
    status: 'Inactive',
    savings: '₹ 45,000',
    loans: '₹ 0',
    avatar: 'AP',
    lastActive: '2023-12-01'
  },
  {
    id: 'M004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91 98765 43213',
    joinDate: '2023-04-05',
    status: 'Active',
    savings: '₹ 2,10,000',
    loans: '₹ 3,75,000',
    avatar: 'SR',
    lastActive: '2024-01-15'
  },
  {
    id: 'M005',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43214',
    joinDate: '2023-05-12',
    status: 'Suspended',
    savings: '₹ 15,000',
    loans: '₹ 85,000',
    avatar: 'VS',
    lastActive: '2023-11-20'
  }
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addMemberDialog, setAddMemberDialog] = useState(false);

  // Filter members based on search and status
  const filteredMembers = membersData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMenuOpen = (event, member) => {
    setAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Statistics
  const totalMembers = membersData.length;
  const activeMembers = membersData.filter(m => m.status === 'Active').length;
  const totalSavings = membersData.reduce((sum, m) => sum + parseInt(m.savings.replace(/[^0-9]/g, '')), 0);
  const activeLoans = membersData.filter(m => m.loans !== '₹ 0').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Members Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage society members, their accounts and transactions
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalMembers}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Members</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={100} sx={{ background: 'rgba(255,255,255,0.3)' }} />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{activeMembers}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Members</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(activeMembers/totalMembers)*100} sx={{ background: 'rgba(255,255,255,0.3)' }} />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Savings sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>₹{(totalSavings/100000).toFixed(1)}L</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Savings</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={75} sx={{ background: 'rgba(255,255,255,0.3)' }} />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAdd sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{activeLoans}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Loans</Typography>
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(activeLoans/totalMembers)*100} sx={{ background: 'rgba(255,255,255,0.3)' }} />
          </StatsCard>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <StyledPaper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<FilterList />} variant="outlined">
              Filters
            </Button>
            <Button startIcon={<Add />} variant="contained" onClick={() => setAddMemberDialog(true)}>
              Add Member
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Members Table */}
      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Member</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Join Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Savings</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Loans</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {member.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{member.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{member.email}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{member.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{member.savings}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: member.loans !== '₹ 0' ? 'warning.main' : 'text.secondary' }}>
                    {member.loans}
                  </TableCell>
                  <TableCell>
                    <StatusChip label={member.status} status={member.status} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <ActionButton onClick={(e) => handleMenuOpen(e, member)}>
                      <MoreVert />
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1, fontSize: 20 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit Member
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Email sx={{ mr: 1, fontSize: 20 }} /> Send Email
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} /> Suspend Account
        </MenuItem>
      </Menu>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialog} onClose={() => setAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Add New Member</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Aadhar Number" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" variant="outlined" multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddMemberDialog(false)}>
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}