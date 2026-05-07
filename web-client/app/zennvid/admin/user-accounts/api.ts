import { ADMIN_USER, CSV_USERS } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios_api from "@/lib/axiosHelper";

/** create user */
export const createUser = async (
  { email, password, username, provider }: {
    email: string,
    password: string,
    username: string,
    provider: string
  }
) => {
  try {
    const api = await axios_api.post(`${ADMIN_USER}`, { email, password, username, provider }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** user delete */
export const deleteUser = async ({ id }: { id: string }) => {
  try {
    const api = await axios_api.delete(`${ADMIN_USER}/${id}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** user get */
export const getAllUser = async (
  {
    page,
    limit,
    search,
    createdAt
  }: {
    page: number,
    limit: number,
    search?: string,
    createdAt?: Date
  }
) => {
  try {
    const api = await axios_api.post(`${ADMIN_USER}/all`, {
      page, limit, search, createdAt
    }, { withCredentials: true })
    return api.data
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/** get csv data */
export const getCSVUsers = async () => {
  try {
    const api = await axios_api.get(`${CSV_USERS}`, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}