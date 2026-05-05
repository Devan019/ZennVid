import { CREATEAPP, GETAPPS, SEND_KEY_URI } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios from "axios";

/**make app */
export const createNewApp = async (name: string) => {
  try {
    const api = await axios.post(CREATEAPP, { name }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}

/**get apis */
export const getApps = async () => {
  try {
    const api = await axios.get(GETAPPS, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}


/**send key to email */
export const sendKey = async ({ appId }: { appId: string }) => {
  try {
    const api = await axios.post(`${SEND_KEY_URI}`, { appId }, { withCredentials: true });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
}
