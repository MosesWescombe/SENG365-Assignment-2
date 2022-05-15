import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material';
import { fetchAuction, fetchCategory } from '../Services/AuctionServices';
import { useEffect, useState } from 'react';
import { IFullAuctionResult } from '../Types/IFullAuctionResult';
import { ICategoryItem } from '../Types/ICategoryItem';

export default function AuctionItem({auctionId}: any) {
    const [auction, setAuction] = useState<IFullAuctionResult | undefined>(undefined)
    const [categorie, setCategorie] = useState<ICategoryItem | undefined>(undefined)

    // Get Auction
    useEffect(() => {
        const getAuction = async () => {
            fetchAuction(auctionId)
            .then((response) => {
                if (response.status !== 200) return


                fetchCategory(response.data.categoryId)
                .then((response) => {
                    setCategorie(response[0])
                })
            
                setAuction(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
          }
    
          getAuction()
    }, [])

    if (auctionId == undefined || auctionId == null) return (<></>);
    if (auction == undefined) return (<></>)

    function monthDiff(d1: Date, d2: Date) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    function weeksDiff(startDate: Date, endDate: Date) {
        const msInWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.floor((endDate.getTime() - startDate.getTime()) / msInWeek);
    }

    function daysDiff(startDate: Date, endDate: Date) {
        const oneDay = 1000 * 60 * 60 * 24;
        const diffInTime = endDate.getTime() - startDate.getTime();
        const diffInDays = Math.floor(diffInTime / oneDay);
        return diffInDays;
    }

    function hoursDiff(startDate: Date, endDate: Date) {
        const oneHour = 1000 * 60 * 60;
        const diffInTime = endDate.getTime() - startDate.getTime();
        const diffInHours = Math.floor(diffInTime / oneHour);
        return diffInHours;
    }

    function minutesDiff(startDate: Date, endDate: Date) {
        const oneMinute = 1000 * 60;
        const diffInTime = endDate.getTime() - startDate.getTime();
        const diffInMinutes = Math.floor(diffInTime / oneMinute);
        return diffInMinutes;
    }

    const getTimeRemaining = (endDateString: string) => {

        const endDateNumber = Date.parse(endDateString)
        const endDate = new Date(endDateNumber)


        const todaysDate = new Date()

        const remainingMonths = monthDiff(todaysDate, endDate)
        const remainingWeeks = weeksDiff(todaysDate, endDate)
        const remainingDays = daysDiff(todaysDate, endDate)
        const remainingHours = hoursDiff(todaysDate, endDate)
        const remainingMinutes = minutesDiff(todaysDate, endDate)

        if (remainingMonths > 0) return `closes in ${remainingMonths} months`
        if (remainingWeeks > 0) return `closes in ${remainingWeeks} weeks`
        if (remainingDays > 1) return `closes in ${remainingDays} days`
        if (remainingDays > 0) return `closes tommorow`
        if (remainingHours > 0) return `closes in ${remainingHours} hours`
        if (remainingMinutes > 0) return `closes in ${remainingMinutes} minutes`
        if (remainingMinutes < 0) return `closed`
        
        return "closing soon"
    }   

    return (
        <Card sx={{ maxWidth: 375, minWidth: 200 }}>
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}
                alt="green iguana"
                />
                <CardContent>
                <Grid item xs={12}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    
                        {categorie !== undefined? <p>{categorie.name}</p> : <></>}
                        <p>{getTimeRemaining(auction.endDate)}</p>
                    </div>
                </Grid>
                <Typography gutterBottom variant="h5" component="div">
                    {auction.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {auction.description}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{}}>
                        <p style={{padding: 0, margin: 0, fontSize: 12}}>{auction.highestBid !== null && auction.highestBid.amount >= auction.reserve? "Reserve met" : "Reserve not met"}</p>
                        <p style={{padding: 0, margin: 0, fontSize: 20}}>${auction.reserve == null? "0.00" : auction.reserve}</p>
                    </div>
                    <Button size="small" color="primary">
                    Place Bid
                    </Button>
                </div>
            </CardActions>
        </Card>
    );
}
