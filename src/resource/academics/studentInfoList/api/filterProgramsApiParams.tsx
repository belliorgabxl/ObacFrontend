"use server";
import { filterProgramsParamsData } from "@/dto/studentDto";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export const filterProgramsData = async (
  term: string,
  year: string
): Promise<filterProgramsParamsData[]> => {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      throw new Error("No auth token found in cookies.");
    }

    // fix to use a api
    const response = await apiClient.get(
      `Student/GetStudentGroupsByTermYear?term=${term}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch program data.");
  }
};
