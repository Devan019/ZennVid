import { DAILY_USER, USER_STATS } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios_api from "@/lib/axiosHelper";



/** change daily user */
export const changeDailyUser = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios_api.post(`${DAILY_USER}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** User stats */
export const userStats = async () => {
  try { 
    const api = await axios_api.get(`${USER_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
