import { GetGradBySubjectId } from "@/dto/gradDto";
import { get } from "http";
import { fetchGetSubjectBySubjectIdData } from "../api/academicStudentApiData";

export const getSubjectBySubjectIdViewData = async (
  groupId: number,
  term: number,
  year: number,
  subjectId: number
): Promise<GetGradBySubjectId[]> => {
  try {
    const data = await fetchGetSubjectBySubjectIdData(
      groupId,
      term,
      year,
      subjectId
    );

    // const editResponse = data.map((item: GetGradBySubjectId) => {
    //   return {};
    // });

    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get subject data");
  }
};
