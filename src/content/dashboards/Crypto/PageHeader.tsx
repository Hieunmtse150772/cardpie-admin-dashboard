import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppConstants from 'src/enums/app';
import User from 'src/models/user.model';

function PageHeader() {
  const userInfor = JSON.parse(localStorage.getItem(AppConstants.USER));
  const {fullname} : User = userInfor
  const user = {
    name: "Admin",
    avatar: '/static/images/avatars/1.jpg'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {user.name}!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
