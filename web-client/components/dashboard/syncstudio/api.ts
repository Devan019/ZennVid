import { SYNCSTUDIO_API } from "@/constants/backend_routes";
import { Error } from "@/lib/apiProvider";
import axios_api from "@/lib/axiosHelper";

//sync
export const syncStudio = async ({ formData }: { formData: FormData }) => {
  try {
    const api = await axios_api.post(`${SYNCSTUDIO_API}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return api.data;
  } catch (error) {
    const err = error as Error;
    return err.response?.data;
  }
};