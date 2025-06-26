"use server";
import { GetUserInfoById } from "@/dto/userDto";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export const fetchGetUserInfoById = async (
  userId: string
): Promise<GetUserInfoById> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await apiClient.get(`/User/GetUserById?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get user data");
  }
};
