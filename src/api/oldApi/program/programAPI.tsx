"use server";
import { GetAllProgram } from "@/dto/programDto";
import { cookies } from "next/headers";

export const fetchGetAllProgram = async (): Promise<GetAllProgram[]> => {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Program/GetAllProgramAsync`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch subject");
    }
    const text = await response.text();
    const json = JSON.parse(text);

    if (!json?.data) {
      throw new Error("Invalid API response: Missing 'data' field");
    }

    const data: GetAllProgram[] = json.data;
    return data;
  } catch (err) {
    return [];
  }
};
