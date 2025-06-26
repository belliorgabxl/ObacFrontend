"use server";
import { MethodDto } from "@/dto/methodDto";
import { cookies } from "next/headers";

export const fetchMethod = async (): Promise<MethodDto> => {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Method/GetEditGradeMethod`,
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

    const data: MethodDto = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching subjects:", err);
    throw err;
  }
};
