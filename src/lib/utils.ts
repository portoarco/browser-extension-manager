import { apiCall } from "@/helper/apiCall";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getData = async () => {
  try {
    const response = await apiCall.get("/browser_extensions?pageSize=100");
    // console.log(response.data);

    return response.data;
    // setData(response.data);
  } catch (error) {
    console.log(error);
  }
};
