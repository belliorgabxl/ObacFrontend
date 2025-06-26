"use server";
import { GetAllAcademicUser } from "@/dto/userDto";
import { cookies } from "next/headers";

export const fetchGetAllAcademicUser = async (): Promise<
  GetAllAcademicUser[]
> => {
  try {
    const token = cookies().get("token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Academic/GetAllAcademicUserAsync`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get teacher data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetAllAcademicUser[] = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
