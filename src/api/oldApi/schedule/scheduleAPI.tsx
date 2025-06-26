"use server";
import {
  GetScheduleBysubjectId,
  StudentGroupScheduleSubject,
  TeacherScheduleSubject,
  CreateScheduleSubjectRequest,
} from "@/dto/schedule";
import { cookies } from "next/headers";

export const fetchGetScheduleBysubjectId = async (
  subjectId: number,
  term: string
): Promise<GetScheduleBysubjectId[]> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/GetScheduleSubjectBySubjectId?subjectId=${subjectId}&term=${term}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get  data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetScheduleBysubjectId[] = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchGetScheduleOfTeacherByTeacherID = async (
  teacherID: string,
  term: number,
  year: number
): Promise<TeacherScheduleSubject> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/GetScheduleOfTeacherByTeacherID?teacherID=${teacherID}&term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Schedule");
    }

    const text = await response.text();
    const json = JSON.parse(text);
    const data: TeacherScheduleSubject = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchGetScheduleOfStudentGroupByGroupID = async (
  groupId: number,
  term: string,
  year: number
): Promise<StudentGroupScheduleSubject> => {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/GetScheduleByStudentGroupID?studentGroupId=${groupId}&term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Schedule");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: StudentGroupScheduleSubject = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const fetchGetScheduleOfStudentByStudentID = async (
  studentId: number,
  term: string,
  year: number
): Promise<StudentGroupScheduleSubject> => {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/GetScheduleOfStudentByStudentID?studentID=${studentId}&term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Schedule");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: StudentGroupScheduleSubject = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchCreateScheduleSubject = async (
  requestBody: CreateScheduleSubjectRequest
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/CreateScheduleSubjectAsync`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return {
        success: false,
        error: `Error: ${response.status} - ${response.statusText} | ${
          data.responseMessage || JSON.stringify(data)
        }`,
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Request failed:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
};

export const fetchDeleteScheduleSubject = async (
  scheduleSubjectId:number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Schedule/DeleteScheduleSubjectByID?scheduelSubjectID=${scheduleSubjectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return {
        success: false,
        error: `Error: ${response.status} - ${response.statusText} | ${
          data.responseMessage || JSON.stringify(data)
        }`,
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Request failed:", err);
    return { success: false, error: "Unexpected error occurred" };
  }
};
