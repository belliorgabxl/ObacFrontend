import { StudentColumns } from "@/dto/studentDto";
import { getStudentByGroupId } from "../api/getStudentByGroupId";

export const getStudentByGroupIdDataView = async (
  groupId: number
): Promise<StudentColumns[]> => {
  try {
    const data = await getStudentByGroupId(groupId);

    const editData = data.map((item, index) => {
      return {
        runningNumber: index + 1,
        studentId: item.studentId.toString(),
        studentName: item.studentName,
        studentSurname: item.studentSurname,
        blank: "",
        more: null,
      };
    });
    return editData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch StudentByGroupId data.");
  }
};
