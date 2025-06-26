"use server";

import {
  GetGradBySubjectId,
  GetGradPerTermByStudentIdDto,
  GetGropGradeAboveModel,
  GetGropGradeBelowModel,
  GetStudentGradeDetailDto,
  GetStudentGroupGradeByGroupIdTermYearDto,
} from "@/dto/gradDto";
import { cookies } from "next/headers";


export const fetchGetGradBySubjectId = async (
  subjectId: number,
  scheduleId: number
): Promise<GetGradBySubjectId[]> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/GetGradeBySubjectAndSchedulSubjectId?subjectId=${subjectId}&scheduleSubjectId=${scheduleId}`,
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
    const data: GetGradBySubjectId[] = json.data;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchGetStudentGradeByTermYear = async (
  studentId: number,
  term: string,
  year: number
): Promise<GetGradPerTermByStudentIdDto | null> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/GetStudentGradeByTermYear?studentId=${studentId}&term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    if (!json?.data) {
      throw new Error("API response does not contain 'data'");
    }
    const data: GetGradPerTermByStudentIdDto = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};

export const GetGropGradeAbove = async (
  grade: number,
  term: string,
  year: number,
  groupId: number
): Promise<GetGropGradeAboveModel | null> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/GetGroupGradeAbove?grade=${grade}&term=${term}&year=${year}&groupId=${groupId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get data in API: ${response.status} ${response.statusText} | ${errorText}`
      );
    }
    const json = await response.json();
    if (!json?.data) {
      throw new Error("API response does not contain 'data'");
    }

    return json.data as GetGropGradeAboveModel;
  } catch (err) {
    console.error("Error in API fetching data:", err);
    return null;
  }
};

export const GetGropGradeBelow = async (
  className: string,
  currentYear: number,
  grade: number,
  term: string,
  year: number
): Promise<GetGropGradeBelowModel[]> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const queryParams = new URLSearchParams({
      class: className,
      currentYear: currentYear.toString(),
      term: term,
      year: year.toString(),
      grade: grade.toString(),
    });

    const url = `${
      process.env.NEXT_PUBLIC_API_URL_V1
    }/Grade/GetStudentIfGradeBelow?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get data");
    }

    const json = await response.json();
    if (!json?.data) {
      throw new Error("API response does not contain 'data'");
    }

    const data: GetGropGradeBelowModel[] = json.data;
    return data;
  } catch (err) {
    console.error("Error in API fetching data:", err);
    return [];
  }
};


export const fetchUpdateCompleteScheduleSubject = async (
  scheduleSubjectId: number
) => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Method/UpdateCompleteScheduleSubject?scheduleSubjectId=${scheduleSubjectId}&isCompleted=true`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} - ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage += ` | ${errorData.message || JSON.stringify(errorData)}`;
      } catch {
        console.warn("Response does not contain JSON.");
      }

      return { success: false, error: errorMessage };
    }

    const text = await response.text();
    return { success: true, data: text ? JSON.parse(text) : {} };
  } catch (err: any) {
    console.error("Error in API CompleteGrade", err);
    return { success: false, error: err.message };
  }
};

export const fetchGetStudentGradeDetail = async (
  studentId: number,
): Promise<GetStudentGradeDetailDto | null> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentGradeDetail?studentId=${studentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    if (!json?.data) {
      throw new Error("API response does not contain 'data'");
    }
    const data: GetStudentGradeDetailDto = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};

export const fetchGetStudentGroupGradeByGroupIdTermYear = async (
  groupId:number,
  term:string,
  year:number,
  subjectId:number,
): Promise<GetStudentGroupGradeByGroupIdTermYearDto[] | null> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/GetStudentGroupGradeByGroupIdTermYear?groupId=${groupId}&term=${term}&year=${year}&subjectId=${subjectId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get data");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    if (!json?.data) {
      throw new Error("API response does not contain 'data'");
    }
    const data: GetStudentGroupGradeByGroupIdTermYearDto[] = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
};