import Backdrop from "@mui/material/Backdrop"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteAuction } from "../Services/AuctionServices"
import { IFullAuctionResult } from "../Types/IFullAuctionResult"
import { AuctionFormModal } from "./AuctionFormModal"

export const EditAuctionControls = ({auction, toggleTrigger}: any) => {
    auction = auction as IFullAuctionResult
    const [modalOpen, setModalOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate()

    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    const openModal = () => {
        setModalOpen(true)
    }

    const deleteAuctionReq = async () => {
        const response = await deleteAuction(auction.auctionId)
        if (response == undefined || response.status !== 200) console.log(response)
        else navigate('/my-auctions')
    }

  return (
      <div>
        <Paper style={{display: 'flex', justifyContent: 'center', padding: '12px', gap: '5px'}}>
            <Button variant='contained' disabled={auction.numBids > 0} onClick={openModal}>Edit</Button>
            <Button variant='contained' disabled={auction.numBids > 0} color='error' onClick={handleOpenAlert}>Delete</Button>
        </Paper>

        <Dialog
            open={openAlert}
            onClose={handleOpenAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure you want to delete "{auction.title}"?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You cannot reverse these changes.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAlert}>Cancel</Button>
                <Button onClick={async () => await deleteAuctionReq()} autoFocus color='error'>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
        
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
            open={modalOpen}
        >
            {modalOpen?
                <AuctionFormModal edit={true} auction={auction} onClose={() => {setModalOpen(false); toggleTrigger()}}/>
            : <></>}
        </Backdrop>
      </div>
  )
}