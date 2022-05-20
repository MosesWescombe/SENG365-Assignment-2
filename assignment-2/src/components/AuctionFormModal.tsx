import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from "react"
import { fetchCategories, fetchImage, patchAuction, postAuction, uploadPhoto } from "../Services/AuctionServices"
import { ICategoryItem } from "../Types/ICategoryItem"
import { FormHelperText } from "@mui/material"

const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

const tommorow = (): Date => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
}

export const AuctionFormModal = ({ onClose, auction, create, edit }: any) => {
    const tommorowDate: Date = tommorow()

    const [reserve, setReserve] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [endDate, setEndDate] = useState(tommorow())
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])
    const [category, setCategory] = useState<ICategoryItem | undefined>(undefined)
    const [categoryString, setCategoryString] = useState<string>("")
    const [formErrors, setFormErrors] = useState({title: "", description: "", category: "", global: ""})
    const [todayString, setTodayString] = useState<string>(tommorowDate.toISOString().substring(0, tommorowDate.toISOString().length - 8))
    const [auctionPhoto, setAuctionPhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string
        const categoryTemp = categories.filter((cat: ICategoryItem) => {
            return cat.name === value
        })[0]
        setFormErrors({...formErrors, category: ""})
        setCategoryString(value);
        setCategory(categoryTemp)
    };

    const restrictReserve = (e: any) => {
        const reserveNumber = parseInt(e.target.value)
        setReserve(Math.max(reserveNumber, 1).toString())
    }

    const updateEndDate = (e: any) => {
        const value = e.target.value
        const date = new Date(value)
        setEndDate(date)
        setTodayString(date.toISOString().substring(0, date.toISOString().length - 8))
    }

    useEffect(() => {
        const getCategories = async () => {
            const categoryResponse = await fetchCategories()
            setCategories(categoryResponse)

            if (auction !== undefined && edit) {
                setTitle(auction.title)
                setDescription(auction.description)
                setReserve(auction.reserve.toString())

                const endDateTemp = new Date(auction.endDate)
                setEndDate(endDateTemp)
                setTodayString(endDateTemp.toISOString().substring(0, endDateTemp.toISOString().length - 8))

                const categoryTemp: ICategoryItem = categoryResponse.filter((cat: ICategoryItem) => {
                    return cat.categoryId === auction.categoryId
                })[0]
                setCategory(categoryTemp)
                setCategoryString(categoryTemp.name)

                const image = await fetchImage(auction.auctionId)
                setImageSrc(image);
            } else {
                const image = await fetchImage(-1)
                setImageSrc(image);
            }
        }
        
        getCategories()
    }, [])

    const submitForm = async () => {
        const reserveNumber = parseInt(reserve)

        function GetFormattedDate(date: Date) {
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day  = ("0" + (date.getDate())).slice(-2);
            var year = date.getFullYear();
            var hour =  ("0" + (date.getHours())).slice(-2);
            var min =  ("0" + (date.getMinutes())).slice(-2);
            var seg = ("0" + (date.getSeconds())).slice(-2);
            var mill = ("00" + (date.getMilliseconds())).slice(-3);
            return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg + "." + mill;
        }

        const formattedDate = GetFormattedDate(endDate);

        let body;
        if (reserveNumber >= 1) {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId,
                reserve: (reserveNumber >= 1? reserveNumber : null)
            }
        } else {
            body = {
                title: title,
                description: description,
                endDate: formattedDate,
                categoryId: category?.categoryId
            }
        }

        if (title.length <= 0) {setFormErrors({...formErrors, title: "Required"}); return}
        if (description.length <= 0) {setFormErrors({...formErrors, description: "Required"}); return}
        if (category == undefined) {setFormErrors({...formErrors, category: "Required"}); return}

        let auctionIdTemp;

        if (edit) {
            const response = await patchAuction(body, auction.auctionId)
            if (response == undefined || response.status !== 200) {
                console.log(response)
                const newValue = {...formErrors, title: 'Title is already taken'}
                setFormErrors(newValue)
                return
            }
            auctionIdTemp = auction.auctionId
        }
        else {
            const response = await postAuction(body)
            if (response == undefined) return
            if (response.status !== 201) {
                console.log(response)
                const newValue = {...formErrors, title: 'Title is already taken'}
                setFormErrors(newValue)
                return
            }
            auctionIdTemp = response.data.auctionId
        }

        if (auctionPhoto !== null && auctionPhoto !== undefined) {
            const uploadImageResponse = await uploadPhoto(auctionPhoto, auctionIdTemp)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                const newValue = {...formErrors, global: 'Something went wrong'}
                setFormErrors(newValue)
                return
            }
        } else {
            const newValue = {...formErrors, global: 'Please provide an image'}
            setFormErrors(newValue)
            return
        }

        onClose()
    }

    const changeImage = async (e: any) => {
        const file = e.target.files[0]
        setAuctionPhoto(file)

        if (file == undefined) {
          return
        }
        if (!acceptedFileTypes.includes(file.type)) {
          return
        }
  
        const src = URL.createObjectURL(file)
        setImageSrc(src)
    }

  return (
    <Paper style={{overflow: 'hidden'}}>
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            autoComplete="off"
         >
            <Grid container spacing={2} style={{width: '500px'}}>
                <Grid item xs={12} style={centerCSS}>
                    <Typography gutterBottom variant="h4" color='GrayText'>
                        {edit? "Update auction details" : "Create a new auction"}
                    </Typography>
                </Grid>

                <Grid pb={3} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                    <label htmlFor='file-input'>
                        <img style={{height: '200px', width: 'auto'}} src={imageSrc}></img>
                    </label>
                    <input hidden 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.gif" 
                    id='file-input'
                    onChange={async (e) => await changeImage(e)} />
                </Grid>

                <Grid item xs={12}>
                    <Typography color='red' variant="body1">
                    {formErrors.global}
                    </Typography>
                </Grid>

                <Grid item xs={12} style={centerCSS}>
                    <TextField 
                        required={create}
                        error={formErrors.title !== ""}
                        helperText={formErrors.title}
                        label="Title" 
                        variant="outlined"
                        value={title}
                        onChange={(e: any) => setTitle(e.target.value)}
                    />
                    <FormControl style={{display: 'flex', flexGrow: 1}}>
                        <InputLabel id="category" error={formErrors.category !== ""}>Category</InputLabel>
                        <Select
                        required={create}
                        labelId="category"
                        value={categoryString}
                        label="Category"
                        onChange={handleChange}
                        error={formErrors.category !== ""}
                        >
                            {categories.length > 0? categories.map((category: ICategoryItem) => (
                                <MenuItem key={category.categoryId} value={category.name}>{category.name}</MenuItem>
                            )) : <MenuItem>None</MenuItem>}
                        </Select>
                        <FormHelperText error>{formErrors.category}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} style={centerCSS}>
                    <TextField
                        label="Reserve ($)"
                        value={reserve}
                        type="number"
                        onChange={restrictReserve}
                    />
                    <TextField
                        required={create}
                        label="End Date"
                        type="datetime-local"
                        InputProps={{inputProps: { min: tommorowDate.toISOString().substring(0, tommorowDate.toISOString().length - 8)} }}
                        value={todayString}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e: any) => {updateEndDate(e)}}
                    />
                </Grid>

                <Grid item xs={12} style={centerCSS}>
                    <TextField
                        required={create}
                        fullWidth
                        error={formErrors.description !== ""}
                        helperText={formErrors.description}
                        label="Description"
                        multiline
                        value={description}
                        onChange={(e: any) => setDescription(e.target.value)}
                    />
                </Grid>
                
                <Grid item xs={12} style={centerCSS}>
                    <Button onClick={submitForm} variant='contained' color="success">{edit? "Update" : "Create"}</Button>
                    <Button onClick={onClose} variant='contained'>Cancel</Button>
                </Grid>
            </Grid>
        </Box>
    </Paper>
  )
}

const centerCSS = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px'
}