import { getCommonApiUrl } from "@/services/constants/common";
import { getFetcher, postFetcher } from "@/services/swr/swrConfig";
import useSWR from "swr";
import { DashboardPost } from "@/types/dashboard";

const useGetDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR<DashboardPost[]>(
    getCommonApiUrl("dashboard"),
    getFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    GetDashboard: data,
    error,
    isGetdashboardLoading: isLoading,
    refetchDashboard: mutate,
  };

};

const usePostDashboard = () => {
  const { data, error, isLoading, mutate } = useSWR<DashboardPost[]>(
    getCommonApiUrl("dashboard"),
    async (url) => {
      // Using POST instead of GET
      const response = await postFetcher(url, null);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    GetDashboard: data,
    error,
    isGetdashboardLoading: isLoading,
    refetchDashboard: mutate,
  };
};

export {useGetDashboard, usePostDashboard};