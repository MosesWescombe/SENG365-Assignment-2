import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Grid } from '@mui/material';
import { fetchAuction, fetchImage } from '../Services/AuctionServices';
import { useEffect, useState } from 'react';
import { IFullAuctionResult } from '../Types/IFullAuctionResult';
import AvatarChip from './AvatarChip';
import { useNavigate, useLocation } from "react-router-dom";
import { formatNumberToMoney, getTimeRemaining } from '../Services/CalculationServices';

export default function AuctionItem({auctionId, category, minimized}: any) {
    const [auction, setAuction] = useState<IFullAuctionResult | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const navigator = useNavigate()

    // Get Auction
    useEffect(() => {
        const getAuction = async () => {
            const response = await fetchAuction(auctionId)
            if (response.status == 200) setAuction(response.data)
            else {
                console.log(response)
                return
            }

            const image = await fetchImage(response.data.auctionId)
            setImage(image);
          }

          getAuction()
    }, [])

    if (auctionId == undefined || auctionId == null) return (<></>);
    if (auction == undefined) return (<></>)
    
    const openItem = () => {
        navigator(`/auction/${auction.auctionId}`)
    }

    return (
        <Card sx={{ maxWidth: 375, minWidth: 200}}>
            <CardActionArea onClick={openItem}>
                <CardMedia
                component="img"
                height="180"
                image={image}
                alt={auction.title}
                />
                <CardContent style={{paddingBottom: 0}}>
                    {!minimized? (
                        <Grid item xs={12}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                {category !== undefined? <p>{category.name}</p> : <></>}
                                <p>{getTimeRemaining(auction.endDate)}</p>
                            </div>
                        </Grid>
                    ): <></>}
                
                        <Typography gutterBottom variant="h5" component="div">
                            {auction.title}
                        </Typography>

                     {!minimized? (
                         <div>
                            <Typography variant="body2" color="text.secondary" style={{maxHeight: 40, overflow: 'hidden'}}>
                                {auction.description}
                            </Typography>
                            <div style={{marginTop: 10, marginRight: -8, display: 'flex', justifyContent: 'end'}}>
                                <AvatarChip id={auction.sellerId} name={auction.sellerFirstName + " " + auction.sellerLastName}/>
                            </div>
                         </div>
                    ): <></>}
                    </CardContent>
                
                <CardActions>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <p style={{padding: 0, margin: 0, fontSize: 12}}>
                                {auction.highestBid !== null && auction.highestBid >= auction.reserve? "Reserve (met)" : "Reserve (not met)"}
                            </p>
                            <p style={{padding: 0, margin: 0, fontSize: 20}}>
                                {auction.reserve == undefined || auction.reserve == null? "$0.00" : formatNumberToMoney(auction.reserve)}
                            </p>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
                            <p style={{padding: 0, margin: 0, fontSize: 12}}>
                                {auction.highestBid == null? "Starting Bid" : "Highest Bid"}
                            </p>
                            <p style={{padding: 0, margin: 0, fontSize: 20}}>
                                {auction.highestBid == null? "$0.00" : formatNumberToMoney(auction.highestBid)}
                            </p>
                        </div>
                    </div>
                </CardActions>

            </CardActionArea>
        </Card>
    );
}
