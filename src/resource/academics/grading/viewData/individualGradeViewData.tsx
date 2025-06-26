import { GetAllStudentTableDto, StudentTranscriptData } from "@/dto/studentDto";
import {
  GetAllStudentDataApi,
  GetStudentByIdDataApi,
} from "../api/individualGradeApiData";

export async function getAllStudentViewData() {
  const studentData = await GetAllStudentDataApi();
  // console.log(studentData);

  const studentTableData: GetAllStudentTableDto[] = studentData.map(
    (student) => ({
      studentId: student.studentId,
      studentCode: student.studentCode,
      thaiName: `${student.thaiName} ${student.thaiLastName}`,
      class: `${student.class}.${student.groupName}`,
      currentYear: student.currentYear,
      facultyName: student.facultyName,
      subProgramName: student.programName,
      programName: student.programName,
    })
  );

  return studentTableData;
}

export async function getStudentDataById(
  studentId: number
): Promise<StudentTranscriptData> {
  const data = await GetStudentByIdDataApi(studentId);

  return data;
}
