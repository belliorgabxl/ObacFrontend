import { GetSubjectByGroupId } from "@/dto/subjectDto";

export interface StudentCreateData {
  userName: string;
  password: string;
  firstName: string; // /
  lastName: string; // /
  thaiName: string; // /
  thaiLastName: string; // /
  gender: string; // /
  studentGroupId: number; // 1
  studentCode: string; // null
  thaiId: string; // /
  email: string; // /
  phoneNumber: string; // /
  address: string;
  nationality: string;
  religion: string;
  class: string; // null
  enrollYear: number; // หลังบ้านทำให้ได้
  currentYear: number; // null
  graduateYear: number; // null
  currentRoom: string; // null
  programId: number;
  facultyId: number;
  birthDate: Date; // /
}
export interface EducationData {
  classLevel: string;
  groupsCourse: FacultyInfo[];
}
export interface FacultyInfo {
  facultyName: string;
  groupProgram: ProgramInfo[];
}
export interface ProgramInfo {
  programName: string;
  group: GroupInfo[];
}

export interface GroupInfo {
  groupId: number;
  groupName: string;
}

export interface filterProgramsParamsData {
  facultyName: string;
  programName: string;
  class: string;
  groupId: string;
  groupName: string;
  groupCode: string;
}

export interface StudentColumns {
  runningNumber: number;
  studentId: string;
  studentName: string;
  studentSurname: string;
  blank: string;
  more: string | null;
}

export interface StudentInfoByGroupId {
  studentId: number;
  studentName: string;
  studentSurname: string;
}

export interface StudentGroup {
  studentGroupId: number;
  groupName: string;
  class: string;
  program: string;
  studentCount: number;
}

export interface GetStudentByGroupId {
  studentId: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  gender : string;
  gpa: number;
  gpax: number;
  totalCredit: number;
  subject: GetSubjectByGroupId[];
}

export interface GetAllStudent {
  studentId: number;
  firstName: string | null;
  lastName: string | null;
  thaiName: string;
  thaiLastName: string;
  gender: string;
  groupName: string;
  studentGroupId: number;
  studentCode: string;
  thaiId: string;
  email: string;
  phoneNumber: string;
  address: string;
  nationality: string;
  religion: string;
  role: string;
  userId: string;
  isActive: boolean;
  class: string;
  enrollYear: number;
  currentYear: number;
  graduateYear: number;
  currentRoom: string;
  programId: number;
  programName: string;
  facultyId: number;
  facultyName: string;
  birthDate: string | null;
}

export interface GetAllStudentTableDto {
  studentId: number;
  studentCode: string;
  thaiName: string;
  class: string;
  currentYear: number;
  facultyName: string;
  subProgramName: string;
  programName: string;
}

export interface TermQuery {
  subject_name: string;
  subject_code: string;
  credit: string;
  finalGrade: string;
  remark: string;
  collectScore: number;
  affectiveScore: number;
  testScore: number;
  gradeId: number;
}

export interface YearData {
  term: string;
  year: number;
  totalCredit: number;
  termQuery: TermQuery[];
}

export interface StudentTranscriptData {
  studentId: number;
  firstName: string;
  lastName: string;
  thaiName: string;
  thaiLastName: string;
  class: string;
  currentYear: number;
  studentCode: string;
  groupName: string;
  programName: string;
  facultyName: string;
  subProgramName: string;
  year: YearData[];
}

export interface GetStudentUser {
  studentId: number;
  firstName: string;
  lastName: string;
  thaiName: string;
  thaiLastName: string;
  gender: string;
  groupName: string;
  studentGroupId: number;
  studentCode: string;
  thaiId: string;
  email: string;
  phoneNumber: string;
  address: string;
  nationality: string;
  religion: string;
  role: string;
  userId: string;
  isActive: boolean;
  class: string;
  enrollYear: number;
  currentYear: number;
  graduateYear: number;
  currentRoom: string;
  programId: number;
  programName: string;
  facultyId: number;
  facultyName: string;
  birthDate: string;
}

export type StudentDto = {
  studentCode: string;
  studentId: number;
  studentName: string;
  studentSurname: string;
};
export type StudentListByGroupIDDto = {
  studentCode: string;
  studentId: number;
  gender:string;
  firstName: string;
  lastName: string;
  studentStatus:string;
}
export type GetStudentListByGroupIDDto = {
  groupId: number;
  groupName: string;
  groupCode: string;
  programName: string;
  programId: number;
  facultyName: string;
  subProgramName: string;
  class: string;
  students: StudentListByGroupIDDto[];
};
export type GetStudentByStudentId = {
  studentId: number;
  firstName: string | null;
  lastName: string | null;
  thaiName: string;
  thaiLastName: string;
  gender: "Male" | "Female" | string;
  groupName: string;
  studentGroupId: number;
  studentCode: string;
  studentStatus: string;
  thaiId: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  nationality: string | null;
  religion: string | null;
  role: string;
  userId: string;
  isActive: boolean;
  class: string;
  enrollYear: number | null;
  currentYear: number;
  graduateYear: number | null;
  currentRoom: string;
  programId: number;
  programName: string;
  facultyId: number;
  facultyName: string;
  birthDate: string | null;
};

export type GetStudentGroupsByTermYearDto = {
  groupId: number;
  groupName: string;
  class: string;
  groupCode: string;
  level: number;
  programId: number;
  facultyName: string;
  programName: string;
  subProgramName: string;
  teacherId: number | null;
  limit: number;
  year: number;
  term: string;
  program: any | null;
  scheduleSubject: any[];
};

export type UpdateStudentRequestBody = {
  studentId: number;
  firstName: string |null;
  lastName: string| null;
  thaiName: string;
  thaiLastName: string;
  gender: string;
  studentGroupId: number;
  studentCode: string;
  thaiId: string|null;
  email: string|null;
  phoneNumber: string|null;
  address: string|null;
  nationality: string|null;
  religion: string|null;
  class: string;
  enrollYear: number|null;
  currentYear: number;
  graduateYear: number|null;
  programId: number;
  facultyId: number;
  birthDate: string | null;
  isActive: boolean;
  isAgree: boolean;
};