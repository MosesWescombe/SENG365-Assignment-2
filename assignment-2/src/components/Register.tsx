import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login, register, uploadProfilePhoto } from '../Services/Users';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';

const theme = createTheme();
const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

export default function Register({userId, setUserId}: any) {
    const [formErrors, setFormErrors] = useState({email: '', password: '', fName: '', lName: '', global: ''})
    const [showPassword, setShowPassword] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const navigate = useNavigate()

    // Submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Get data
      const data = new FormData(event.currentTarget);
      const email: string = data.get('email') as string || ""
      const password: string = data.get('password') as string || ""
      const firstName: string = data.get('firstName') as string || ""
      const lastName: string = data.get('lastName') as string || ""

      // Validate forms
      const emailValid = validateEmail(email)
      const passwordValid = validatePassword(password)
      const fNameValid = validateFirstName(firstName)
      const lNameValid = validateLastName(lastName)
      const formValid = fNameValid && lNameValid && passwordValid && emailValid;
      
      if (!formValid) return;

      const registerResponse = await register(firstName, lastName, email, password)

      if (registerResponse === 500) {
        const newValue = {...formErrors, email: 'Email is already taken'}
        setFormErrors(newValue)
        return
      }

      const loginResponse = await login(email, password)

      if (loginResponse !== 200) {
        const newValue = {...formErrors, global: 'Something went wrong'}
        setFormErrors(newValue)
        return
      }

      if (profilePhoto !== null && profilePhoto !== undefined) {
        const uploadImageResponse = await uploadProfilePhoto(profilePhoto)
        if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
          const newValue = {...formErrors, global: 'Something went wrong'}
          setFormErrors(newValue)
        }
      }

      navigate('/')
    };

    // Validate functions 
    const validateEmail = (email: any) => {
      if (email == '') {
        const newValue = {...formErrors, email: 'Required'}
        setFormErrors(newValue)
      } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
        const newValue = {...formErrors, email: ''}
        setFormErrors(newValue)
        return true;
      } else {
        const newValue = {...formErrors, email: 'Email is not formatted correctly'}
        setFormErrors(newValue)
      }

      return false;
    }

    const validatePassword = (password: any) => {
      if (password == '') {
        const newValue = {...formErrors, password: 'Required'}
        setFormErrors(newValue)
      } else if (password.length >= 6) {
        const newValue = {...formErrors, password: ''}
        setFormErrors(newValue)
        return true;
      } else {
        const newValue = {...formErrors, password: 'Password must be at least 6 characters long'}
        setFormErrors(newValue)
        return false;
      }
    }

    const validateFirstName = (fName: any) => {
      if (fName !== '') {
        const newValue = {...formErrors, fName: ''}
        setFormErrors(newValue)
        return true;
      } else {
        const newValue = {...formErrors, fName: 'Required'}
        setFormErrors(newValue)
        return false;
      }
    }

    const validateLastName = (lName: any) => {
      if (lName !== '') {
        const newValue = {...formErrors, lName: ''}
        setFormErrors(newValue)
        return true;
      } else {
        const newValue = {...formErrors, lName: 'Required'}
        setFormErrors(newValue)
        return false;
      }
    }

    const changeProfile = async (e: any) => {
      const file = e.target.files[0]
      setProfilePhoto(file)
      console.log(file)
      if (file == undefined) {
        setImageSrc("")
        return
      }
      if (!acceptedFileTypes.includes(file.type)) {
        setImageSrc("")
        return
      }

      const src = URL.createObjectURL(file)
      setImageSrc(src)
    }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="form" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleSubmit(e)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <>
                      <label htmlFor='file-input'>
                        <DriveFileRenameOutlineSharpIcon color='primary' />
                      </label>
                      <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
                    </>
                  }>
                  <Avatar sx={{height: 100, width: 100}} alt="User" src={imageSrc} />
                </Badge>
              </Grid>

              <Grid item xs={12}>
                <Typography color='red' variant="body1">
                  {formErrors.global}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus

                  error={formErrors.fName !== ''}
                  helperText={formErrors.fName}
                  onChange={(e) => validateFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"

                  error={formErrors.lName !== ''}
                  helperText={formErrors.lName}
                  onChange={(e) => validateLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"

                  error={formErrors.email !== ''}
                  helperText={formErrors.email}
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel required error={formErrors.password !== ''} htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    required
                    error={formErrors.password !== ''}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => {validatePassword(e.target.value)}}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  <FormHelperText error id="component-helper-text">{formErrors.password}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}