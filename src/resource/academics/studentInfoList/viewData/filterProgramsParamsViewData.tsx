import { filterProgramsParamsData, EducationData } from "@/dto/studentDto";
import { filterProgramsData } from "../api/filterProgramsApiParams";

export async function filterProgramsViewData(
  term: string,
  year: string
): Promise<EducationData[]> {
  try {
    const data = await filterProgramsData(term, year);

    const groupedData = data.reduce(
      (acc: Record<string, EducationData>, item: filterProgramsParamsData) => {
        const {
          class: classLevel,
          facultyName,
          programName,
          groupId,
          groupName,
        } = item;

        if (!acc[classLevel]) {
          acc[classLevel] = {
            classLevel,
            groupsCourse: [],
          };
        }

        let faculty = acc[classLevel].groupsCourse.find(
          (f) => f.facultyName === facultyName
        );

        if (!faculty) {
          faculty = {
            facultyName,
            groupProgram: [],
          };
          acc[classLevel].groupsCourse.push(faculty);
        }

        let program = faculty.groupProgram.find(
          (p) => p.programName === programName
        );

        if (!program) {
          program = {
            programName,
            group: [],
          };
          faculty.groupProgram.push(program);
        }

        program.group.push({
          groupId: parseInt(groupId, 10),
          groupName,
        });

        return acc;
      },
      {}
    );

    const editData: EducationData[] = Object.values(groupedData);
    return editData;
  } catch (error) {
    console.error("Error fetching or transforming data:", error);
    throw error;
  }
}

export async function getRawProgramViewData(
  term: string,
  year: string
): Promise<filterProgramsParamsData[]> {
  const data = await filterProgramsData(term, year);
  return data as filterProgramsParamsData[];
}
