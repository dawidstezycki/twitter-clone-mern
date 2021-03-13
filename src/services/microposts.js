import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/microposts'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async content => {
  const config = {
    headers: {Authorization: token},
  }
  const object = {
    content
  }
  const response = await axios.post(baseUrl, object, config)
  return response.data
}

export default {getAll, setToken, create}