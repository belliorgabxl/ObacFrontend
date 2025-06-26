"use server";
import { ClassSubjectData } from "@/dto/gradingDto";
import axios from "axios";
import { cookies } from "next/headers";

export const getClassSubjectData = async (
  subjectId: number,
  term: number
): Promise<ClassSubjectData[]> => {
  try {
    const token = cookies().get("token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/GetScheduleSubjectBySubjectId?subjectId=${subjectId}&term=${term}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get teacher enrollment data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: ClassSubjectData[] = json.data;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch class subject data.");
  }
};

export const putPublishGrade = async (
  schedule_subject_id: number
): Promise<void> => {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/PublishGrade?scheduleSubject_id=${schedule_subject_id}&isPublished=true`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to publish grade.");
  }
};
