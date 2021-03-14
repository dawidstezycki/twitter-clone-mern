import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/users'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getUser = async (userid) => {
  const response = await axios.get(`${baseUrl}/${userid}`)
  return response.data
}

export default { getUser }