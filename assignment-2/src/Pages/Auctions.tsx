import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import AuctionItem from "../components/AuctionItem"
import { fetchAuctions, fetchCategories } from "../Services/AuctionServices"
import { IAuctionResult } from "../Types/IAuctionResult"
import { ICategoryItem } from "../Types/ICategoryItem"

export const Auctions = () => {
    const [auctions, setAuctions] = useState<IAuctionResult[] | []>([])
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])

    useEffect(() => {
        const getAuctions = async () => {
            const response = await fetchAuctions()

            if (response.status !== 200) return
            
            setAuctions(response.data.auctions)

            const categoryResponse = await fetchCategories()
            setCategories(categoryResponse)
          }
    
          getAuctions()
    }, [])

    const getCategory = (categoryId: number) => {
        return categories.filter((categorie: ICategoryItem) => categorie.categoryId === categoryId)[0]
    }

  return (
    <div className="auction-page">
        <Grid alignContent='center' alignItems='center' container spacing={4} sx={{padding: '40px 120px'}}>
            {auctions.length > 0? auctions.map((auction) => {
                return (
                    <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3}>
                        {categories.length > 0? <AuctionItem auctionId={auction.auctionId} category={getCategory(auction.categoryId)}/> : <></>}
                    </Grid>
                )
            }) : ""}
        </Grid>
    </div>
  )
}
