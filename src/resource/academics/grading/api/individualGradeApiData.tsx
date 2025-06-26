"use server";
import { GetAllStudent, StudentTranscriptData } from "@/dto/studentDto";
import { cookies } from "next/headers";

export async function GetAllStudentDataApi(): Promise<GetAllStudent[]> {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetAllStudent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetAllStudent[] = json.data;
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get student data");
  }
}

export async function GetStudentByIdDataApi(
  id: number
): Promise<StudentTranscriptData> {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentGradeDetail?studentId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const text = await response.text();
    const json = JSON.parse(text);
    const data: StudentTranscriptData= json.data;
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get student data");
  }
}
