import axios from 'axios';
import { ICategoryItem } from '../Types/ICategoryItem';

export const fetchAuctions = async () => {
    return await axios.get(`http://localhost:4941/api/v1/auctions`)
    .then((response) => {
        return response;
    })
    .catch((error) => {
      return error.response;
    })
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