"use server";
import { GetGradBySubjectId } from "@/dto/gradDto";
import apiClient from "@/lib/apiClient";
import { cookies } from "next/headers";

export const fetchGetSubjectBySubjectIdData = async (
  groupId: number,
  term: number,
  year: number,
  subjectId: number
): Promise<GetGradBySubjectId[]> => {
  try {
    const token = cookies().get("token")?.value;
    const response = await apiClient.get(
      `Grade/GetStudentGroupGradeByGroupIdTermYear?groupId=${groupId}&term=${term}&year=${year}&subjectId=${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get subject data");
  }
};
