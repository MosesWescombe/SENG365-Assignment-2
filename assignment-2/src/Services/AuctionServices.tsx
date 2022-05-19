import axios from 'axios';
import Cookies from 'js-cookie';
import { IAuctionConfig } from '../Types/Configs/IGetAuctionConfig';
import { ICategoryItem } from '../Types/ICategoryItem';

export const fetchBids = async (auctionId: number) => {
  const response =  await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}/bids`)
  return response;
}

export const fetchAuctions = async (config: IAuctionConfig) => {
    const response =  await axios.get(`http://localhost:4941/api/v1/auctions`, { params: config})
    return response;
 }

export const fetchAuction = async (id: number) => {
  return await axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
  .then((response) => {
      return response;
  })
  .catch((error) => {
    return error.response;
  })
}

export const fetchCategory = async (categoryId: number) => {
  return await axios.get(`http://localhost:4941/api/v1/auctions/categories`)
  .then((response) => {
      const categories = response.data
      const categorie = categories.filter((categorie: ICategoryItem, index: number) => categorie.categoryId === categoryId)
      return categorie;
  })
  .catch((error) => {
    return error.response;
  })
}

export const fetchCategories = async () => {
  const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`)
  if (response.status !== 200) return []
  return response.data
}

export const fetchImage = async (auctionId: number): Promise<string> => {
  return await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}/image`)
  .then((response) => {
    return `http://localhost:4941/api/v1/auctions/${auctionId}/image`
  })
  .catch((error) => {
    return require("../assets/no_image.png")
  })
}

export const postBid = async (auctionId: number, amount: number) => {
  const config = {
    headers: {
        "X-Authorization": Cookies.get('UserToken') || ""
    }
  }

  const response = await axios.post(`http://localhost:4941/api/v1/auctions/${auctionId}/bids`, {
    amount: amount
  }, config)
  return response
}