import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/microposts'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getMicroposts = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createMicropost = async content => {
  const config = {
    headers: {Authorization: token},
  }
  const object = {
    content
  }
  const response = await axios.post(baseUrl, object, config)
  return response.data
}

export default {getMicroposts, setToken, createMicropost}