export const APIURLS = {
  dashboard: "/posts", 
};

export const getCommonApiUrl = (apiName: keyof typeof APIURLS): string => {
  return APIURLS[apiName];
};