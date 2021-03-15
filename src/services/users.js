import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/users'

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

const updateUserRelationship = async (userid, relationships) => {
  const config = {
    headers: { Authorization: token },
  }

  const object = {
    relationships
  };
  
  const response = await axios.put(`${baseUrl}/${userid}`, object, config)
  return response.data
}

export default { getUser, getUsers, updateUserAdmin, updateUserRelationship, setToken }