import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAuction, fetchAuctions, fetchCategories, fetchImage } from "../Services/AuctionServices";
import { IFullAuctionResult } from "../Types/IFullAuctionResult";
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { getProfilePhotoFor } from "../Services/UserServices";
import { ICategoryItem } from "../Types/ICategoryItem";
import { formatDate, getTimeRemaining } from "../Services/CalculationServices";
import AuctionItem from "../components/AuctionItem";
import { IAuctionResult } from "../Types/IAuctionResult";

export const AuctionItemPage = () => {
    let { auctionId } = useParams();
    const [auction, setAuction] = useState<IFullAuctionResult | undefined>(undefined)
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])
    const [similarAuctions, setSimilarAuctions] = useState<IAuctionResult[] | []>([])
    const [image, setImage] = useState<string | undefined>(undefined)

    // Get Auction
    useEffect(() => {
        const getAuction = async () => {
            if (auctionId == undefined) return

            const auctionResponse = await fetchAuction(parseInt(auctionId))
            if (auctionResponse.status == 200) setAuction(auctionResponse.data)
            else console.log(auctionResponse)
            
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
          }
    
          getAuction()
    }, [auctionId])

    const getCategory = (categoryId: number) => {
        return categories.filter((categorie: ICategoryItem) => categorie.categoryId === categoryId)[0]
    }

    const getCategoryName = (categoryId: number): string => {
        const result = getCategory(categoryId)
        return result == undefined? "No category" : result.name
    }
    
    if (auctionId == undefined) return (<></>);
    if (auction == undefined) return (<></>);

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div>
            <Grid container columnSpacing={2} sx={{width: {xs: '99%', sm: '98%', md: '95%', lg: '95%'}, maxWidth: '1500px'}}>
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
                    <Grid container item xs={12} pt={2} columnSpacing={2}>
                        <Grid item xs={12} md={3}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="h5">
                                    Description:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={9} pt={1}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} gutterBottom variant="body1">
                                {auction.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{display: 'flex', justifySelf: 'center'}} variant="h5">
                                    Similar:
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} style={{padding: '12px 40px'}} spacing={3} display='flex' justifyContent='space-around'>
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
                            Closes: {formatDate(auction.endDate)} (<strong>{getTimeRemaining(auction.endDate) }</strong>)
                        </Typography>
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