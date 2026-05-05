import { TRANSACTION_CSV, TX_CHARTCHANGE, TX_HISTORY, TX_STATS } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios from "axios";

/**  change-daily-revenue  */
export const changeDailyRevenue = async (
  {
    date,
    state,
  }: {
    date: Date,
    state: 'Prev' | 'Next'
  }
) => {
  try {
    const api = await axios.post(`${TX_CHARTCHANGE}`, { date, state }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** Transcation Stats  */
export const txStats = async () => {
  try {
    const api = await axios.get(`${TX_STATS}`, { withCredentials: true })
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}



/** get transaction csv */
export const getTransactionCSV = async () => {
  try {
    const api = await axios.get(`${TRANSACTION_CSV}`, { withCredentials: true });
    return api.data;
  } catch (error) { 
    const err = error as Error;
    return err.response?.data;
  }
}

/** get transaction history */
export const getTransactionHistory = async (
  { page, limit, search, createdAt }: {
    page: number,
    limit: number,
    search?: string,
    createdAt?: Date
  }
) => {
  try {
    const api = await axios.post(`${TX_HISTORY}`, { page, limit, search, createdAt }, { withCredentials: true });
    return api.data;
  } catch (error) {
    return null;
  }
}


