import { getCommonApiUrl } from "@/services/constants/common";
import { getFetcher } from "@/services/swr/swrConfig";
import apiClient from "@/services/swr/apiFetcher";
import { DashboardPost } from "@/types/dashboard";

export const commonApi = {
  // Get Dashboard Data using GET
  getDashboard: async (): Promise<DashboardPost[]> => {
    return await getFetcher(getCommonApiUrl("dashboard"));
  },

  // Alternative: Get Dashboard Data using POST (if your API requires POST)
  getDashboardPost: async (): Promise<DashboardPost[]> => {
    const response = await apiClient.post(getCommonApiUrl("dashboard"));
    return response.data;
  },
};