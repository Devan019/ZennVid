import { DAILY_VIDEO, VIDEO_STATS } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios from "axios";

/** change daily video */
export const changeDailyVideo = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${DAILY_VIDEO}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/** Video Stats */
export const videostats = async () => {
  try {
    const api = await axios.get(`${VIDEO_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

