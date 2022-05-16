import Grid from "@mui/material/Grid"
import Pagination from '@mui/material/Pagination';
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react"
import AuctionItem from "../components/AuctionItem"
import { fetchAuctions, fetchCategories } from "../Services/AuctionServices"
import { IAuctionResult } from "../Types/IAuctionResult"
import { ICategoryItem } from "../Types/ICategoryItem"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const displayAmount = 4

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const sortOptions: string[] = [
  'Closing soon',
  'Closing late',
  'Highest bid',
  'Lowest bid',
  'Highest reserve',
  'Lowest reserve',
  'Title ascending',
  'Title descending',
];

export const Auctions = () => {
    const [auctions, setAuctions] = useState<IAuctionResult[] | []>([])
    const [categories, setCategories] = useState<ICategoryItem[] | []>([])
    const [pages, setPages] = useState(3)
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState<string>(sortOptions[0]);
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<ICategoryItem[] | []>([])
    const [status, setStatus] = useState("ANY");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleFilterMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = (event: any, category?: any) => {
        setAnchorEl(null)
        if (!category) return

        const newFiltersRemoved = filters.filter((categoryTemp: ICategoryItem) => (
            categoryTemp.categoryId !== category.categoryId
        ))
        const newFiltersAdded = [...newFiltersRemoved, category]
        setFilters(newFiltersAdded)
        update(page, sortBy, searchTerm, newFiltersAdded)
    };

    const handleStatusChange = (event: any, value: string) => {
        setStatus(value)
        update(page, sortBy, searchTerm, filters, value)
    };

    const handleSortChanged = (event: SelectChangeEvent<typeof sortBy>) => {
        const {
            target: { value },
        } = event;

        update(page, value)
        setSortBy(value)
    };

    const handleSearchChange = (event: any) => {
        const parameter = event.target.value
        update(page, sortBy, parameter)
        setSearchTerm(parameter)
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        update(value)
        setPage(value)
    };

    const convertToBackEndSort = (sortByString: string): string => {
        switch(sortByString) {
            case 'Closing soon':
                return 'CLOSING_SOON'
            case 'Closing late':
                return "CLOSING_LAST"
            case 'Highest bid':
                return "BIDS_DESC"
            case 'Lowest bid':
                return "BIDS_ASC"
            case 'Highest reserve':
                return "RESERVE_DESC"
            case 'Lowest reserve':
                return "RESERVE_ASC"
            case 'Title ascending':
                return "ALPHABETICAL_ASC"
            case 'Title descending':
                return "ALPHABETICAL_DESC"
            default:
                return 'CLOSING_SOON' 
        }
    }

    const getAuctions = async (pageNumber?: number, sortByString?: string, search?: string, filtersArray?: ICategoryItem[], statusString?: string) => {
        if (pageNumber == undefined) pageNumber = page
        if (sortByString == undefined) sortByString = sortBy
        if (search == undefined) search = searchTerm
        if (filtersArray == undefined) filtersArray = filters
        if (statusString == undefined) statusString = status

        let categoryIdsList: number[] = []
        for (let i=0; i < filtersArray.length; i++) {
            categoryIdsList.push(filtersArray[i].categoryId)
        }

        const config = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            sortBy: convertToBackEndSort(sortByString),
            q: search,
            categoryIds: categoryIdsList,
            status: statusString
        }

        const response = await fetchAuctions(config)

        if (response.status !== 200) return
        
        setAuctions(response.data.auctions)
        setPages(Math.ceil(response.data.count / displayAmount))

        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)
    }

    const update = (pageNumber?: number, sortByString?: string, search?: string, filtersArray?: ICategoryItem[], statusString?: string) => {
        getAuctions(pageNumber, sortByString, search, filtersArray, statusString)
    }

    useEffect(() => {
        update()
    }, [])

    const getCategory = (categoryId: number) => {
        return categories.filter((categorie: ICategoryItem) => categorie.categoryId === categoryId)[0]
    }

    const handleFilterClick = (category: ICategoryItem) => {
        const newFilters = filters.filter((categoryTemp: ICategoryItem) => (
            categoryTemp.categoryId === category.categoryId
        ))

        setFilters(newFilters)
        update(page, sortBy, searchTerm, newFilters)
    };
    
    const handleFilterDelete = (category: ICategoryItem) => {
        const newFilters = filters.filter((categoryTemp: ICategoryItem) => (
            categoryTemp.categoryId !== category.categoryId
        ))

        setFilters(newFilters)
        update(page, sortBy, searchTerm, newFilters)
    };

  return (
    <div className="auction-page">
        <Grid alignContent='center' alignItems='center' container spacing={4} sx={{padding: '40px 120px'}}>
            <Grid item xs={12} style={{paddingTop: 8, display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                <Stack direction="row" spacing={1} sx={{display: 'flex', alignItems: 'center'}}>
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleFilterMenuClick}
                    >
                        Add Filter
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleFilterMenuClose}
                        MenuListProps={{'aria-labelledby': 'basic-button',}}
                    >
                        {categories.length > 0? categories.map((category: ICategoryItem) => (
                            <MenuItem key={category.categoryId} onClick={(e) => handleFilterMenuClose(e, category)}>{category.name}</MenuItem>
                        )) : <MenuItem>None</MenuItem>}
                    </Menu>
                </div>
                    {filters.map((category: ICategoryItem) => (
                        <Chip
                            key={category.categoryId}
                            label={category.name}
                            variant="filled"
                            onDoubleClick={() => handleFilterClick(category)}
                            onDelete={() => handleFilterDelete(category)}
                        />
                    ))}

                </Stack>
            </Grid>
            <Grid item xs={12} style={{paddingTop: 8, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <TextField fullWidth label="Search" id="search" onChange={handleSearchChange}/>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-name-label">Sort By</InputLabel>
                    <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={sortBy}
                    onChange={handleSortChanged}
                    input={<OutlinedInput label="Sort By" />}
                    MenuProps={MenuProps}
                    >
                    {sortOptions.map((sortOption) => (
                        <MenuItem
                        key={sortOption}
                        value={sortOption}
                        >
                        {sortOption}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <ToggleButtonGroup
                    color="primary"
                    value={status}
                    exclusive
                    size='large'
                    onChange={handleStatusChange}
                >
                    <ToggleButton value="ANY">All</ToggleButton>
                    <ToggleButton value="OPEN">Open</ToggleButton>
                    <ToggleButton value="CLOSED">Closed</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            {auctions.length > 0? (
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <Pagination size='large' count={pages} page={page} onChange={handleChange} />
                </Grid>
            ) : <></>}
            {auctions.length > 0? (
                auctions.map((auction) => {
                    return (
                        <Grid key={auction.auctionId} item xs={12} md={6} lg={4} xl={3}>
                            {categories.length > 0? <AuctionItem auctionId={auction.auctionId} category={getCategory(auction.categoryId)}/> : <></>}
                        </Grid>
                    )
                })
            ) : ""}
            {auctions.length > 0? (
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                    <Pagination size='large' count={pages} page={page} onChange={handleChange} />
                </Grid>
            ) : (
                <div style={{padding: 30,width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <Typography gutterBottom variant="h4" color='GrayText'>
                        There Are No Auctions
                    </Typography>
                </div>
            )}
        </Grid>
    </div>
  )
}
