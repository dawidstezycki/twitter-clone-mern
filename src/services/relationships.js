import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/relationships'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getRelationship = async (relationshipId) => {
  const response = await axios.get(`${baseUrl}/${relationshipId}`)
  return response.data
}

const createRelationship = async (userFollowed) => {
  const config = {
    headers: { Authorization: token },
  }
  const object = {
    followed: userFollowed
  };

  const response = await axios.post(baseUrl, object, config)
  return response.data
}

const deleteRelationship = async (relationshipId) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${relationshipId}`, config)
  return response.data
}

export default { getRelationship, createRelationship, deleteRelationship, setToken }