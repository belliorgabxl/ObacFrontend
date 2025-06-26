"use server";
import {
  GetAllStudent,
  GetStudentByStudentId,
  GetStudentGroupsByTermYearDto,
  GetStudentListByGroupIDDto,
  GetStudentUser,
  StudentCreateData,
  StudentGroup,
  UpdateStudentRequestBody,
} from "@/dto/studentDto";
import { cookies } from "next/headers";

export const fetchCreateStudentAsync = async (
  studentData: StudentCreateData
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/CreateStudent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to post data");
    }

    const data = await response.json();
  } catch (err) {
    console.error("Error:", err);
  }
};

export const fetchGetAllStudentGroup = async (): Promise<StudentGroup[]> => {
  const token = cookies().get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetAllStudentGroup`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Group");
    }
    const text = await response.text();
    const json = JSON.parse(text);

    if (!json?.data) {
      throw new Error("Invalid API response: Missing 'data' field");
    }

    const data: StudentGroup[] = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching Group:", err);
    return [];
  }
};

export const fetchStudentUser = async (): Promise<GetStudentUser> => {
  try {
    const userId = cookies().get("userId")?.value;
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentByUserId?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch in API");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetStudentUser = json.data;
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const GetStudentListByGroupID = async (
  groupId: number
): Promise<GetStudentListByGroupIDDto | null> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentListByGroupID?groupid=${groupId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch in API");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetStudentListByGroupIDDto = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching student list:", err);
    return null;
  }
};

export const fetchGetAllStudent = async (): Promise<GetAllStudent[]> => {
  try {
    const token = cookies().get("token")?.value;
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
    if (!response.ok) {
      throw new Error("Failed to fetch in API");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    const data: GetAllStudent[] = json.data;
    return data;
  } catch (err) {
    console.error("Error fetching student list:", err);
    return [];
  }
};

export const fetchGetStudentByStudentId = async (
  studentId: number
): Promise<GetStudentByStudentId | null> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) throw new Error("Missing authentication token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentByStudentID?studentId=${studentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch API: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    if (!text) throw new Error("Empty response from API");

    const json = JSON.parse(text);
    const data: GetStudentByStudentId = json.data;

    return data;
  } catch (err) {
    console.error("Error fetching student data:", err);
    return null;
  }
};

export const fetchGetStudentGroupsByTermYear = async (
  term: string,
  year: number
): Promise<GetStudentGroupsByTermYearDto[]> => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) throw new Error("Missing authentication token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/GetStudentGroupsByTermYear?term=${term}&year=${year}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch API: ${response.status} ${response.statusText}`
      );
    }
    const text = await response.text();
    if (!text) throw new Error("Empty response from API");

    const json = JSON.parse(text);
    const data: GetStudentGroupsByTermYearDto[] = json.data;

    return data;
  } catch (err) {
    console.error("Error fetching student data:", err);
    return [];
  }
};

export const fetchUpdateStudentStatus = async (
  studentId: number,
  status: string
) => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/UpdateStudentStatus?studentId=${studentId}&status=${status}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.ok;
  } catch (err) {
    console.error("Error updating student status:", err);
    return false;
  }
};

export const fetchUpdateGroup = async (
  studentId: number,
  groupId: number
) => {
  try {
    const token = cookies().get("token")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/StudentGroup/UpdateGroup?studentId=${studentId}&groupId=${groupId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.ok;
  } catch (err) {
    console.error("Error updating student group:", err);
    return false;
  }
};

export const fetchUpdateStudent = async (studentData: UpdateStudentRequestBody): Promise<boolean> => {
  try {
    const token = cookies().get("token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Student/UpdateStudent`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error("API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('API error:', error);
    return false;
  }
};

export const fetchPromoteStudentGroup = async (data: {
  studentIds: number[];
  groupId:number;
  newGroupName: string;
  newGroupCode: string;
  year: number;
  term: string;
}) => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_V1}/Promote/PromoteStudentsByGroup`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} - ${response.statusText}`;
      const errorText = await response.text(); 
      console.error("API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      try {
        const errorData = await response.json();
        errorMessage += ` | ${errorData.message || JSON.stringify(errorData)}`;
      } catch {
        console.warn("Response does not contain JSON.");
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Error in API Promote Student", err);
    return null;
  }
};