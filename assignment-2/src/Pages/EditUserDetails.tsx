import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import { deleteProfilePhoto, getLoggedInUser, getProfilePhoto, login, register, updateUser, uploadProfilePhoto } from '../Services/UserServices';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IUserResult } from '../Types/IUserResult';

const theme = createTheme();
const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

export default function EditUserDetails() {
    const [formErrors, setFormErrors] = useState({email: '', password: '', fName: '', lName: '', currentPassword: '', global: ''})
    const [showPassword, setShowPassword] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const [user, setUser] = useState<IUserResult | undefined>(undefined)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    // Submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // Get data
      const data = new FormData(event.currentTarget);
      const email: string = data.get('email') as string || ""
      const password: string = data.get('password') as string || ""
      const currentPassword: string = data.get('oldPassword') as string || ""
      const firstName: string = data.get('firstName') as string || ""
      const lastName: string = data.get('lastName') as string || ""

      // Validate forms
      const emailValid = validateEmail(email)
      const fNameValid = validateFirstName(firstName)
      const lNameValid = validateLastName(lastName)
      let passwordValid = true
      if (password.length > 0 && currentPassword.length < 1) {
        const newValue = {...formErrors, currentPassword: 'Required'}
        setFormErrors(newValue)
        console.log(newValue)
        return
      } else {
        const newValue = {...formErrors, currentPassword: ''}
        setFormErrors(newValue)
      }

      const formValid = fNameValid && lNameValid && passwordValid && emailValid;
      
      if (!formValid) return;

      let updateResponse;
      if (password.length > 0 && currentPassword.length > 0) {
        updateResponse = await updateUser(firstName, lastName, email, password, currentPassword)
      } else {
        updateResponse = await updateUser(firstName, lastName, email)
      }

      console.log(updateResponse)
      if (updateResponse === 400) {
        const newValue = {...formErrors, currentPassword: 'Incorrect password'}
        setFormErrors(newValue)
        return
      }
      if (updateResponse === 500) {
        const newValue = {...formErrors, email: 'Email is already taken'}
        setFormErrors(newValue)
        return
      }
      if (updateResponse !== 200) {
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
      } else {
        const uploadImageResponse = await deleteProfilePhoto()
        if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
          const newValue = {...formErrors, global: 'Something went wrong'}
          setFormErrors(newValue)
        }
      }

      navigate('/profile')
      document.location.reload()
    };

    // Validate functions 
    const validateEmail = (email: any) => {
      setEmail(email)
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
      if (password.length === 0 || password.length >= 6) {
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
      setFirstName(fName)

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
      setLastName(lName)

      if (lName !== '') {
        const newValue = {...formErrors, lName: ''}
        setFormErrors(newValue)
        setLastName(lName)
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

    React.useEffect(() => {
        const update = async () => {
            const response = await getLoggedInUser()
            if (response == undefined || response.status !== 200){navigate('/login'); return}

            setUser(response.data)
            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)

            if (imageSrc == "") setImageSrc(getProfilePhoto())
        }

        update()
    }, [])

    const removeProfileImage = () => {
      setImageSrc("none")
      setProfilePhoto(null)
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
                    <DeleteForeverIcon onClick={removeProfileImage} color='primary' />
                  }>
                  <label htmlFor='file-input'>
                    <Avatar sx={{height: 100, width: 100}} alt={firstName} src={imageSrc} />
                  </label>
                  <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
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
                  value={firstName}
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
                  value={lastName}

                  error={formErrors.lName !== ''}
                  helperText={formErrors.lName}
                  onChange={(e) => validateLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={email}

                  error={formErrors.email !== ''}
                  helperText={formErrors.email}
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel error={formErrors.password !== ''} htmlFor="password">Password</InputLabel>
                  <OutlinedInput
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
                  <FormHelperText error>{formErrors.password}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="oldPassword" error={formErrors.currentPassword !== ''}>Current Password</InputLabel>
                  <OutlinedInput
                    id="oldPassword"
                    name="oldPassword"
                    error={formErrors.currentPassword !== ''}
                    type={showPassword ? 'text' : 'password'}
                    onChange={() => {setFormErrors({...formErrors, currentPassword: ""})}}
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
                    label="Current Password"
                  />
                  <FormHelperText error>{formErrors.currentPassword}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item container xs={12} mt={2} columnSpacing={1} style={{display: 'flex', justifyContent: 'center'}}>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                  >
                    Save Changes
                  </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate('/profile')}
                    >
                      Cancel
                    </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}