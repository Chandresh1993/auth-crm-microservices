import axios from "axios";

const crmService = axios.create({
  baseURL: process.env.REACT_APP_CRM_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default crmService;
