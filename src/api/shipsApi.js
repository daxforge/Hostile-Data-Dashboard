import axios from "axios";

// Using Vite's server proxy to bypass CORS blocks during local development
const API = "/api-fleet/api/ships";

export const fetchShips = async () => {
  const res = await axios.get(API);
  return res.data;
};
