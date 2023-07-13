import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GoogleIcon from '@mui/icons-material/Google';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
// components
import { LoginForm } from '../../../components/Login/index';
import { login } from 'src/features/authSlice';
import LoginDto from 'src/dtos/login.dto';
import { useAppDispatch } from 'src/app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import Role from 'src/enums/role.enum';
import AppConstants from 'src/enums/app';
// ----------------------------------------------------------------------
// import logo from 'assets/logo/logo-cardpieee-09 1.png';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const LoginPage = () => {
  //   const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate()

  const isAuthenticated = localStorage.getItem('user') ? true : false
  const dispatch = useAppDispatch();
  // const googleAuth = new GoogleAuthProvider();

  //login gmail password
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const payload : LoginDto = {email, password}
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        try {
          const result =await dispatch(login(payload));
          const user = unwrapResult(result);
          console.log("user: ", user)
          const {
            data: { role, refresh_token, access_token, fullname, email },
          } = user;
          console.log("first")
          console.log("role", role)
          if (String(role) === Role.Admin){
            console.log("admin")
            console.log("fullname: ", fullname)
            localStorage.setItem(AppConstants.ACCESS_TOKEN, access_token);
            localStorage.setItem(AppConstants.REFRESH_TOKEN, refresh_token);
            localStorage.setItem(AppConstants.USER, JSON.stringify(user));
          }
          navigate('/dashboards/crypto');
        } catch (error) {
          console.error(error);
        }  
      }
  }
  return (
    <>
      <Helmet>
        <title> Login | CardPie </title>
      </Helmet>

      <StyledRoot>
        <Box
          component="img"
          sx={{ height: 150, width: 150, objectFit: 'cover' , position: 'fixed', marginLeft: 5}}
          src={"/static/images/logo/logo-cardpieee-09 1.png"}
          alt="logo"
          className="logo"
        />
        <StyledSection>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Cardpie
          </Typography>
          <img src="/static/images/status/Frame.png" alt="login" style={{marginLeft:"30px", width:"700px"}}/>
        </StyledSection>

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to CARDPIE
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don't have an account? {''}
              <Link variant="subtitle2">Get started</Link>
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button fullWidth size="large" color="inherit" variant="outlined" startIcon={<GoogleIcon />}>
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm handleSubmit={handleSubmit} setEmail={setEmail} setPassword={setPassword} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};
export default LoginPage;