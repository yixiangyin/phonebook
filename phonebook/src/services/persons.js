import axios from "axios";
const baseUrl = "api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const update = (personObject) => {
  const url = `${baseUrl}/${personObject.id}`
  return axios
    .put(url, personObject)
    .then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
};

export default { getAll, create, update, remove };
