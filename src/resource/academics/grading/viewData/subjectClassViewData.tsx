import { ClassSubjectColumn, ClassSubjectData } from "@/dto/gradingDto";
import { getClassSubjectData } from "../api/subjectClassData";

export const getSubjectClassViewData = async (
  subjectId: number,
  term: number
): Promise<ClassSubjectColumn[]> => {
  try {
    const data = await getClassSubjectData(subjectId, term);

    const subjectClassColumn = data.map((item: ClassSubjectData) => ({
      id: item.scheduleSubjectId,
      day: item.day,
      period: item.period,
      room: item.class + "." + item.studentGroupName,
      teacherName: item.teacherName,
      isPublish: item.isPublish,
    }));

    return subjectClassColumn;
  } catch (error) {
    console.error("Error in getSubjectClassViewData:", error);
    throw new Error("Failed to convert to subject class view data.");
  }
};
