import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout, isLoggedIn, getProfilePhoto, getLoggedInUser} from '../Services/UserServices';
import { IUserResult } from '../Types/IUserResult';

const imageSize = '120px'

export const ProfilePage = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<IUserResult | undefined>(undefined)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        const update = async () => {
            if (!isLoggedIn()) {navigate('/login'); return}
            
            const response = await getLoggedInUser()
            if (response == undefined || response.status !== 200) {navigate('/login'); return}
            setUser(response.data)
        }

        update()
    }, [])

  return (
    <Grid container style={{padding: '16px', height: '100%'}} xs={12} display='flex' alignItems='center' justifyContent='center'>
        <Grid xs={10} sm={8} md={6} style={centerCSS} mt='10vh'>
            <Paper style={{width: '100%', maxWidth: '400px', padding: '16px'}}>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={12} style={centerCSS}>
                        <Avatar style={{height: imageSize, width: imageSize}} alt='User' src={getProfilePhoto()} />
                    </Grid>
                    <Grid item xs={12} style={centerCSS}>
                        <Typography variant="h4">
                            {user?.firstName + " " + user?.lastName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={centerCSS}>
                        <Typography variant="h6" color='GrayText'>
                            {user?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={centerCSS}>
                        <Button variant='outlined'>Edit</Button>
                        <Button variant='outlined' onClick={async () => await handleLogout()}>Logout</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </Grid>
  )
}

const centerCSS = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px'
}