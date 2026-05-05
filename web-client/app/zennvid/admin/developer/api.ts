import { DAILY_DEVELOPER, DEVELOPER_STATS } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios from "axios";

/** Developer stats */
export const developerstats = async () => {
  try {
    const api = await axios.get(`${DEVELOPER_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** change daily developer */
export const changeDailyDeveloper = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${DAILY_DEVELOPER}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}