import axios from 'axios'

const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUser = async (userid) => {
  const response = await axios.get(`${baseUrl}/${userid}`)
  return response.data
}

const updateUserAdmin = async (userid, admin) => {
  const config = {
    headers: { Authorization: token },
  }

  const object = {
    admin
  };
  const response = await axios.put(`${baseUrl}/${userid}`, object, config)
  return response.data
}

const createUser = async (userData) => {
  const response = await axios.post(`${baseUrl}`, userData)
  return response.data
}

export default { getUser, getUsers, createUser, updateUserAdmin, setToken }