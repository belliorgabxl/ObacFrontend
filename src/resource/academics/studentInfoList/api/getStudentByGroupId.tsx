import { StudentInfoByGroupId } from "@/dto/studentDto";
import apiClient from "@/lib/apiClient";

export const getStudentByGroupId = async (
  groupId: number
): Promise<StudentInfoByGroupId[]> => {
  try {
    const response = await apiClient.get(
      `Student/GetStudentListByGroupID?groupid=${groupId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch student data.");
  }
};
