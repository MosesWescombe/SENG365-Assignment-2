import axios from 'axios';
import Cookies from 'js-cookie';

export const isLoggedIn = (): boolean => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null
}

export const uploadProfilePhoto = async (image: any) => {
    if (!isLoggedIn()) return

    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined
    let imageType = image.type
    if (imageType === 'image/jpg') imageType = 'image/jpeg'

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image, config)
    .then((response) => {
        return response.status;
    })
    .catch((error) => {
      return error.response.status;
    })
}

export const getProfilePhoto = () => {
    if (!isLoggedIn()) return ""
    const userId = parseInt(Cookies.get('UserId') as string || "") || undefined

    return `http://localhost:4941/api/v1/users/${userId}/image`
}

export const logout = async () => {
     const config = {
      headers: {
        "content-type": "application/json",
        "X-Authorization": Cookies.get('UserToken') || ""
      }
    }

    return await axios.post(`http://localhost:4941/api/v1/users/logout`, {}, config)
    .then((response) => {
        Cookies.remove('UserId')
        Cookies.remove('UserToken')
        return response.status;
    })
    .catch((error) => {
      console.log(error)
      return error.response.status;
    })
}

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post(`http://localhost:4941/api/v1/users/register`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
        })
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}

export const login = async (email:string , password: string) => {
    return await axios.post(`http://localhost:4941/api/v1/users/login`, {
        email: email,
        password: password
    })
    .then((response) => {
        Cookies.set('UserId', response.data.userId)
        Cookies.set('UserToken', response.data.token)
        return response.status;
    })
    .catch((error) => {
        console.log(error)
        return error.response.status;
    })
}