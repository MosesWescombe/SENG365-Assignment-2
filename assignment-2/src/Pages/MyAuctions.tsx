import Grid from "@mui/material/Grid"
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from "react"
import AuctionItem from "../components/AuctionItem"
import { fetchAuctions, fetchCategories } from "../Services/AuctionServices"
import { IAuctionResult } from "../Types/IAuctionResult"
import { ICategoryItem } from "../Types/ICategoryItem"
import { getLoggedInUser, getUserId, isLoggedIn } from "../Services/UserServices";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import { AuctionFormModal } from "../components/AuctionFormModal";

const displayAmount = 10

export const MyAuctions = () => {
    const [auctions, setAuctions] = useState<IAuctionResult[] | []>([])
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])
    const [pages, setPages] = useState(1)
    const [page, setPage] = useState(1)
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    let userId: number | undefined = undefined

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        update(value)
        setPage(value)
    };

    const getAuctions = async (pageNumber?: number) => {
        if (pageNumber == undefined) pageNumber = page

        const userResponse = await getLoggedInUser()
        if (userResponse == undefined || userResponse.status !== 200) return //navigate("/login")
        userId = getUserId()

        let config = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            bidderId: userId,
        }

        const bidderResponse = await fetchAuctions(config)
        if (bidderResponse.status !== 200) return

        const config2 = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            sellerId: userId,
        }

        const sellerResponse = await fetchAuctions(config2)
        if (sellerResponse.status !== 200) return
        setAuctions(bidderResponse.data.auctions.concat(sellerResponse.data.auctions))

        setPages(Math.ceil((bidderResponse.data.count + sellerResponse.data.count) / displayAmount))

        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)
    }

    const update = (pageNumber?: number) => {
        getAuctions(pageNumber)
    }

    useEffect(() => {
        if (!isLoggedIn()) navigate('/login')
        update()
    }, [modalOpen])

    const getCategory = (categoryId: number) => {
        return categories.filter((categorie: ICategoryItem) => categorie.categoryId === categoryId)[0]
    }

    const openModal = () => {
        setModalOpen(true)
    }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <Grid alignContent='center' alignItems='center' container sx={{width: {xs: '100%', sm: '98%', md: '95%', lg: '95%'}, maxWidth: '1500px'}}>
            {auctions.length > 0? (
                <Grid item xs={12} py={2} style={{display: 'flex', justifyContent: 'center'}}>
                    <Pagination size='large' count={pages} page={page} onChange={handleChange} />
                </Grid>
            ) : <></>}
            <Grid item xs={12} container spacing={3} display='flex' justifyContent='start'>
                {auctions.length > 0? (
                    auctions.map((auction) => {
                        return (
                            <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3} display='flex' justifyContent='center'>
                                {categories.length > 0? <AuctionItem auctionId={auction.auctionId} category={getCategory(auction.categoryId)}/> : <></>}
                            </Grid>
                        )
                    })
                ) : ""}
            </Grid>
            {auctions.length > 0? (
                <Grid py={2} item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <Pagination size='large' count={pages} page={page} onChange={handleChange} />
                </Grid>
            ) : <></>}
            <Grid item xs={12} py={2} style={{display: 'flex', justifyContent: 'center'}}>
                <Button variant='contained' onClick={openModal}>Add Auction</Button>
            </Grid>
        </Grid>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
            open={modalOpen}
        >
            {modalOpen?
                <AuctionFormModal update={modalOpen} create={true} onClose={() => setModalOpen(false)}/>
            : <></>}
        </Backdrop>
    </div>
  )
}
