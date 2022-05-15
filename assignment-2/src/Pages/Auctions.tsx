import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import AuctionItem from "../components/AuctionItem"
import { fetchAuctions } from "../Services/AuctionServices"
import { IAuctionResult } from "../Types/IAuctionResult"

export const Auctions = () => {
    const [auctions, setAuctions] = useState<IAuctionResult[] | []>([])

    useEffect(() => {
        const getAuctions = async () => {
            const response = await fetchAuctions()

            if (response.status !== 200) return
            
            setAuctions(response.data.auctions)
          }
    
          getAuctions()
    }, [])

  return (
    <div className="auction-page">
        <Grid alignContent='center' alignItems='center' container spacing={4} sx={{padding: '40px 120px'}}>
            {auctions.length > 0? auctions.map((auction) => {
                return (
                    <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3}>
                        <AuctionItem auctionId={auction.auctionId}/>
                    </Grid>
                )
            }) : ""}
        </Grid>
    </div>
  )
}
