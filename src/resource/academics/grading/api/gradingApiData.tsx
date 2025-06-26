import { GradingData, UpdateStudentGrade } from "@/dto/gradingDto";
import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";

export const getGradingData = async (term: number): Promise<GradingData[]> => {
  const token = Cookies.get("token");
  try {
    const response = await apiClient.get(`Subject/GetSubjectByTerm?term=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch grading data.");
  }
};

export const updateGradingStundetData = async (payload: UpdateStudentGrade) => {
  const token = Cookies.get("token");
  try {
    const response = await apiClient.put("Grade/UpdateStudentGrade", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch grading data.");
  }
};
