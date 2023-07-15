import { FC, ChangeEvent, useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Dialog,
  DialogTitle
} from '@mui/material';

import Label from 'src/components/Label';
import { CryptoOrder, CryptoOrderStatus } from 'src/models/crypto_order';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import BulkActions from './BulkActions';
import { useAppDispatch } from 'src/app/store';
import { acctiveAccount, getAccounts } from 'src/features/accountSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import User from 'src/models/user.model';
import { useAppSelector } from 'src/app/hooks';
import AccountsDto from 'src/dtos/accounts.dto';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Navigate, useNavigate } from 'react-router';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
interface Filters {
  status?: CryptoOrderStatus;
}

const getStatusLabel = (cryptoOrderStatus: CryptoOrderStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[cryptoOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  accountList: User[],
  filters: Filters
): User[] => {
  return accountList.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

// const applyPagination = (
//   accountList: User[],
//   page: number,
//   limit: number
// ): CryptoOrder[] => {
//   return accountList.slice(page * limit, page * limit + limit);
// };

function SimpleDialog(props) {
  const { onClose, selectedValue, open, accountPick } = props;
  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose(selectedValue);
  };
  const navigate = useNavigate();

  const handleListItemClick = (value) => {
    onClose(value);
  };
  const updateAccount = async (account: User) => {
    const result = await dispatch(acctiveAccount({
      user_id: account.id,
      type_of_premium: 1
    }))
    if (result) {
      onClose(selectedValue);
      alert('Update account successful');
    }
    navigate('/management/transactions');
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle >Do you want to update this account to premium!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure with your decision, after clicking OK, the account of <span style={{ color: 'red' }}>{selectedValue}</span>  will be updated to premium
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => updateAccount(accountPick)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  accountPick: PropTypes.any.isRequired
};

const RecentOrdersTable = () => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [accountPick, setAccountPick] = useState<User>();

  const handleClickOpen = (account: User) => {
    setAccountPick(account);
    setSelectedValue(account.fullname);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  // const handleSelectAllCryptoOrders = (
  //   event: ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setSelectedCryptoOrders(
  //     event.target.checked
  //       ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
  //       : []
  //   );
  // };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    console.log("page", newPage)
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  // const paginatedCryptoOrders = applyPagination(
  //   filteredCryptoOrders,
  //   page,
  //   limit
  // );
  // const selectedSomeCryptoOrders =
  //   selectedCryptoOrders.length > 0 &&
  //   selectedCryptoOrders.length < cryptoOrders.length;
  // const selectedAllCryptoOrders =
  //   selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();
  const accounts = useAppSelector(state => state.account.current);
  let count = 0

  const dispatch = useAppDispatch();
  const fetchAccountList = async () => {
    const page_size = limit
    await dispatch(
      getAccounts({ page, page_size }),
    ).then(result => unwrapResult(result))
  }
  useEffect(() => {
    fetchAccountList();
  }, [page, limit])
  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Recent Orders"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                /> */}
              </TableCell>
              <TableCell>No</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Is Prememium</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.data?.map((account) => {
              count++
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                account.id
              );
              return (
                <TableRow
                  hover
                  key={account.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, account.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {count}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {account.fullname}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {account.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {account.phone_number}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {Number(account.type_of_premium) === 1 ? "Monthly" : "Chưa đăng kí premium"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {account.status}
                    </Typography>
                  </TableCell>
                  {Number(account.type_of_premium) === 1 ? <TableCell align="center"><WorkspacePremiumIcon style={{ color: 'green' }}></WorkspacePremiumIcon></TableCell> : <TableCell align="center">
                    <Tooltip title="Update Account" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="large"
                        // onClick={() => updateAccount(account.id)}
                        onClick={() => handleClickOpen(account)}
                      >
                        <UpgradeIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>}
                  <SimpleDialog
                    selectedValue={selectedValue}
                    accountPick={accountPick}
                    open={open}
                    onClose={handleClose}
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={accounts?.total_count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
