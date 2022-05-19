import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAuction, fetchAuctions, fetchBids, fetchCategories, fetchImage, postBid } from "../Services/AuctionServices";
import { IFullAuctionResult } from "../Types/IFullAuctionResult";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { getProfilePhotoFor, getUserId, isLoggedIn } from "../Services/UserServices";
import { ICategoryItem } from "../Types/ICategoryItem";
import { formatDateNoDay, formatDate, getTimeRemaining, formatNumberToMoney } from "../Services/CalculationServices";
import AuctionItem from "../components/AuctionItem";
import { IAuctionResult } from "../Types/IAuctionResult";
import Paper from '@mui/material/Paper';
import { IBidResult } from "../Types/IBidResult";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

export const AuctionItemPage = () => {
    let { auctionId } = useParams();
    const [auction, setAuction] = useState<IFullAuctionResult | undefined>(undefined)
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])
    const [similarAuctions, setSimilarAuctions] = useState<IAuctionResult[] | []>([])
    const [image, setImage] = useState<string | undefined>(undefined)
    const [bids, setBids] = useState<IBidResult[] | []>([])
    const [amount, setAmount] = useState<number>(1)
    const [amountError, setAmountError] = useState<string | undefined>(undefined)
    const [userId, setUserId] = useState<number | undefined>(undefined)
    const [trigger, setTrigger] = useState(false)
    const navigator = useNavigate()

    const update = async () => {
        if (auctionId == undefined) return

        const auctionResponse = await fetchAuction(parseInt(auctionId))
        if (auctionResponse.status == 200) setAuction(auctionResponse.data)
        else console.log(auctionResponse)

        if (auctionResponse.data.highestBid !== null) setAmount(auctionResponse.data.highestBid + 1)
        else setAmount(1)
        
        const categoryResponse = await fetchCategories()
        if (categoryResponse !== []) setCategories(categoryResponse)
        else console.log(categoryResponse)

        const config = {
            categoryIds: [categoryResponse.filter((categorie: ICategoryItem) => categorie.categoryId === auctionResponse.data.categoryId)[0].categoryId],
            sellerId: auctionResponse.data.sellerId
        }

        const similarResponse = await fetchAuctions(config)
        if (similarResponse.status == 200) {
            setSimilarAuctions(similarResponse.data.auctions.filter((similarAuction: IAuctionResult) => (
                similarAuction.auctionId != auctionResponse.data.auctionId
            )))
        } 
        else {console.log(similarResponse)}

        const image = await fetchImage(auctionResponse.data.auctionId)
        setImage(image);

        const bidResponse = await fetchBids(auctionResponse.data.auctionId)
        if (bidResponse.status == 200) setBids(bidResponse.data)
        else console.log(bidResponse)

        setUserId(getUserId())
    }

    // Get Auction
    useEffect(() => {
        const setup = async () => {
            await update();
        }

        setup()
    }, [auctionId, trigger])

    const getCategory = (categoryId: number) => {
        return categories.filter((categorie: ICategoryItem) => categorie.categoryId === categoryId)[0]
    }

    const getCategoryName = (categoryId: number): string => {
        const result = getCategory(categoryId)
        return result == undefined? "No category" : result.name
    }
    
    if (auctionId == undefined) return (<></>);
    if (auction == undefined) return (<></>);

    const handleAmountChange = (e: any) => {
        const value = e.target.value
        setAmount(parseInt(value.toString().replaceAll(".", "").replaceAll("-", "").replaceAll(",", "")))
    }

    const placeBid = async () => {
        if(!isLoggedIn()) { 
            navigator("/login")
            return
        }

        const tempAmount = parseInt(amount.toString().replaceAll(".", "").replaceAll("-", "").replaceAll(",", ""))

        if (auction.highestBid !== null && amount <= auction.highestBid) setAmountError("Your bid must be higher than the current bid")
        else if (auction.highestBid !== null && amount <= 0) setAmountError("Your bid must be higher than $0")
        else setAmountError(undefined)

        const response = await postBid(auction.auctionId, tempAmount)
        console.log(response)
        if (response.status == 201) setTrigger(!trigger);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div>
            <Grid container columnSpacing={2} sx={{display: 'flex', alignItems: 'start', width: {xs: '99%', sm: '98%', md: '95%', lg: '95%'}, maxWidth: '1500px'}}>
                <Grid item xs={12} width='100%' py={1} display='flex' flexDirection='row'>
                    <Typography variant="h6" color='gray' pr={1}>
                        Category:
                    </Typography>
                    <Typography variant="h6">
                        {getCategoryName(auction.categoryId)}
                    </Typography>
                </Grid>
                <Grid item container xs={12} md={8}>
                    <Grid item xs={12}>
                        <div style={imageContainerCSS}>
                            <img style={imageCSS} src={image}>
                            </img>
                        </div>
                    </Grid>
                    <Grid container item spacing={2} xs={12} pt={2}>
                        <Grid item xs={12} md={3}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="h5">
                                    Description:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9} pt={2}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="body1">
                                {auction.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} variant="h5">
                                    Similar:
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} style={{padding: '12px 40px'}} spacing={3} display='flex' justifyContent='start'>
                            {similarAuctions.map((similarAuction: IAuctionResult) => (
                                <Grid item xs={12} sm={6} md={4} xl={3} key={similarAuction.auctionId}>
                                    <div style={{maxWidth: '250px'}}>
                                        <AuctionItem  minimized auctionId={similarAuction.auctionId} category={getCategory(similarAuction.categoryId)}/>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item container spacing={2} xs={12} md={4} style={{height: '100%'}}>
                    <Grid item style={{gap: 15}} display='flex' alignItems='center' justifyContent='center' xs={12}>
                        <Avatar
                            alt={auction.sellerFirstName}
                            src={getProfilePhotoFor(auction.sellerId)}
                            sx={{ width: 56, height: 56 }}
                        />
                        <Typography style={{display: 'flex', justifySelf: 'center'}} variant="h5">
                            {auction.sellerFirstName + " " + auction.sellerLastName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="h4">
                            {auction.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} display='flex' flexDirection='row' justifyContent='space-between'>
                        <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="body1">
                        <strong style={{paddingRight: 4}}>{getTimeRemaining(auction.endDate) == "closed"? "Closed" : "Closes"}:</strong> {" " + formatDate(auction.endDate)} ({getTimeRemaining(auction.endDate) })
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{padding: 10, width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <Grid container item xs={12} py={2}>
                                <Grid item xs={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography variant="h4">
                                        {auction.highestBid !== null? formatNumberToMoney(auction.highestBid) : "$0.00"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography gutterBottom variant="h6">
                                        <strong>Reserve:</strong> {formatNumberToMoney(auction.reserve)} ({auction.highestBid >= auction.reserve? "met" : "not met"})
                                     </Typography>
                                </Grid>

                                {userId == undefined || userId !== auction.sellerId?
                                    <Grid py={5} item xs={12} style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                                        <TextField
                                            error={amountError !== undefined}
                                            helperText={amountError}
                                            label="Amount ($)"
                                            type="number"
                                            value={amount}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{ inputProps: { min: 0 } }}
                                            variant="outlined"
                                            onChange={handleAmountChange}
                                        />
                                        <Button
                                            onClick={placeBid} 
                                            startIcon={<AddIcon/>} 
                                            variant="contained"
                                            disabled={getTimeRemaining(auction.endDate) == "closed"}
                                        >
                                            Place Bid
                                        </Button>
                                    </Grid>
                                : (<></>)}
                                
                                <Grid item xs={12} style={{display: 'flex', justifyContent: 'start'}}>
                                    <Typography variant="h6">
                                        <strong>Bids:</strong> {auction.numBids}
                                     </Typography>
                                </Grid>
                                <Grid item container spacing={1} xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                                    {bids.map((bid: IBidResult, index: number) => (
                                        <Grid key={index} item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                                            <Paper style={{backgroundColor: 'lightGray', padding: '5px 25px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                                <span>{formatNumberToMoney(bid.amount)}</span>
                                                <span>{bid.firstName + " " + bid.lastName}</span>
                                                <Avatar
                                                    alt={bid.firstName}
                                                    src={getProfilePhotoFor(bid.bidderId)}
                                                    sx={{ width: 35, height: 35 }}
                                                />
                                                <span>{formatDateNoDay(bid.timestamp)}</span>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            </div>
        </div>
    )
}

const imageContainerCSS = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    maxHeight: '700px',
    border: '2px solid lightgray'
}

const imageCSS = {
    flexShrink: 0,
    minWidth: '100%',
    minHeight: '100%',
}