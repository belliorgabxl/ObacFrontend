"use server";
import { ClassroomByGroupIdData } from "@/dto/gradingDto";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function getClassroomByGroupId(
  groupId: number,
  term: string,
  year: number
): Promise<ClassroomByGroupIdData> {
  try {
    const token = cookies().get("token")?.value;
    const response = await apiClient.get(
      `Grade/GetGroupSummaryGrade?groupId=${groupId}&term=${term}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch classroom by group id data");
  }
}
