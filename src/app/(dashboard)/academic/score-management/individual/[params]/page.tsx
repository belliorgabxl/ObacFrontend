"use client";
import { fetchGetStudentGradeDetail } from "@/api/oldApi/grad/gradAPI";
import { LabelText } from "@/components/common/labelText/labelText";
import SummaryGradPDF from "@/lib/PDF/SummaryGrade";
import { Badge } from "@/components/ui/badge";
import { GetStudentGradeDetailDto } from "@/dto/gradDto";
import { StudentTranscriptData, TermQuery, YearData } from "@/dto/studentDto";
import { getStudentDataById } from "@/resource/academics/grading/viewData/individualGradeViewData";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StudentPopup, SubjectData } from "../component/studentPopup";
import { Download, Loader2, Users } from "lucide-react";
import { DataTableStudentInfo } from "@/components/common/MainTable/table_style_studentInfo";

interface StudentDataProps {
  name: string;
  studentCode: string;
}

const StudentInfoByIdPage = ({ params }: { params: { params: string } }) => {
  const studentId = params.params;
  console.log(studentId);
  const [studentTranscriptDataById, setStudentTranscriptDataById] =
    useState<StudentTranscriptData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const [scoreFileData, setScoreFileData] =
    useState<GetStudentGradeDetailDto | null>();

  const [termData, setTermData] = useState<YearData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentDataById(Number(studentId));
        console.log(data);
        setStudentTranscriptDataById(data);
        setTermData(data.year);
        const data2 = await fetchGetStudentGradeDetail(Number(studentId));
        setScoreFileData(data2);
        setIsLoadingPage(true);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchData();
  }, [studentId]);

  const studentData: StudentDataProps = {
    name:
      `${studentTranscriptDataById?.thaiName} ${studentTranscriptDataById?.thaiLastName}` ||
      "",
    studentCode: studentTranscriptDataById?.studentCode || "",
  };

  return (
    <div className=" mx-4 sm:mx-10 lg:mx-10 p-4">
      <div className="w-full flex justify-start ">
        <div className="px-10 rounded-3xl  flex gap-2 items-center  border border-gray-100 shadow-md  py-2 text-blue-700 text-xl w-fit">
          <Users className="h-8 w-8" />
          จัดการคะแนน (รายบุคคล)
        </div>
      </div>
      {isLoadingPage ? (
        <div className="px-4 py-6 mx-4">
          <div className="flex justify-between w-full py-4">
            <Link
              href={
                "/academic/student-details/" +
                studentTranscriptDataById?.studentId
              }
              className="grid align-middle lg:w-[800px] hover:bg-gray-50 duration-300   w-fit px-4 py-2 border  rounded-lg"
            >
              <div className="flex gap-8 mx-4 sm:mx-10 lg:mx-10 p-4 items-center">
                <div className="bg-gray-600 text-white px-5 py-0.5 text-xl rounded-md">
                  ข้อมูลนักเรียน
                </div>
                <div className="text-lg text-black">
                  {studentTranscriptDataById?.class}.
                  {studentTranscriptDataById?.groupName}
                </div>
              </div>
              <div className="flex items-center">
                <LabelText
                  topic={"ชื่อ-นามสกุล"}
                  data={`${studentTranscriptDataById?.thaiName} ${studentTranscriptDataById?.thaiLastName}`}
                />
                <LabelText
                  topic={"รหัสนักเรียน"}
                  data={`${studentTranscriptDataById?.studentCode}  (${studentId})`}
                />
              </div>
              <div className="flex items-center">
                <LabelText
                  topic={"หลักสูตร"}
                  data={`${studentTranscriptDataById?.programName}`}
                />
                <LabelText
                  topic={"สาขาวิชา"}
                  data={`${studentTranscriptDataById?.subProgramName}`}
                />
              </div>
            </Link>
            <div className="px-5 ">
              <div className="flex items-center gap-2 py-3 ">
                {scoreFileData ? (
                  <button
                    className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1 shadow-sm shadow-slate-300 h-fit "
                    onClick={() => {
                      SummaryGradPDF(scoreFileData);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <p>ดาวโหลดน์ผลการเรียน PDF</p>
                  </button>
                ) : (
                  <div>ไม่มี</div>
                )}
                 <button
                    className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1 shadow-sm shadow-slate-300 h-fit cursor-not-allowed "
                  >
                    <Download className="w-4 h-4" />
                    <p>ดาวโหลดน์Transcript</p>
                  </button>
              </div>
            </div>
          </div>
          <StudentTermTable termData={termData} studentData={studentData} />
        </div>
      ) : (
        <div className="mt-2 border-2 border-dashed rounded-md border-gray-400 grid place-items-center py-20 text-3xl text-blue-400 font-semibold items-center">
          <p className="flex gap-2">
            <Loader2 className="h-10 w-10 animate-spin" />
            Loading...
          </p>
        </div>
      )}
    </div>
  );
};

function StudentTermTable({
  termData,
  studentData,
}: {
  termData: YearData[];
  studentData: StudentDataProps;
}) {
  const [isOpenPopUp, setIsOpenPopUp] = useState<boolean>(false);
  const [subjectDataByRowClick, setSubjectDataByRowClick] =
    useState<SubjectData | null>(null);

  const handleRowClick = (subjectName: string) => {
    const subject = termData.flatMap((year) =>
      year.termQuery.filter((term) => term.subject_name === subjectName)
    )[0];

    if (subject) {
      setSubjectDataByRowClick(subject);
      setIsOpenPopUp(true);
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      label: "รายวิชา",
      key: "subject_name",
      className: "w-5/12 px-4 py-2 text-left font-semibold ",
    },
    {
      label: "รหัสวิชา",
      key: "subject_code",
      className: "w-2/12 px-4 py-2 text-center font-semibold justify-start",
    },
    {
      label: "หน่วยกิต",
      key: "credit",
      className: "w-2/12 px-4 py-2 text-center font-semibold justify-center",
    },
    {
      label: "เกรด",
      key: "finalGrade",
      className: "w-3/12 px-4 py-2 text-center font-semibold justify-center",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded ${
            row.isNegative
              ? "bg-red-600 text-white"
              : row.isPass
              ? "bg-green-600 text-white"
              : ""
          }`}
        >
          {row.finalGrade}
        </span>
      ),
    },
  ];

  const calculateGpa = (termQuery: TermQuery[], totalCredit: number) => {
    let totalGradePoints = 0;

    termQuery.forEach((term) => {
      if (!term.finalGrade || term.finalGrade === "N/A") {
        return;
      }

      const grade = parseFloat(term.finalGrade);
      const credit = parseFloat(term.credit);

      if (isNaN(grade) || isNaN(credit)) {
        return;
      }

      totalGradePoints += grade * credit;
    });

    if (totalCredit <= 0) return "0.00";

    const gpa = totalGradePoints / totalCredit;
    return gpa.toFixed(2);
  };

  return (
    <div className="">
      {termData.map((year, index) => {
        // console.log(year.termQuery);
        const transformedData = year.termQuery.map((term) => ({
          subject_name: term.subject_name,
          subject_code: term.subject_code,
          credit: term.credit,
          finalGrade: term.remark === null ? term.finalGrade : term.remark,
          isFailed:
            (term.remark !== "ผ." && term.remark !== null) ||
            term.finalGrade === "0"
              ? true
              : false,
        }));

        return (
          <div key={index} className="mb-6 border p-4 rounded-lg">
            <div className="mx-6 justify-between flex text-xl">
              <Badge variant={"outline"}>
                <h3 className="text-lg font-bold ">
                  ปีการศึกษา {year.year} เทอม {year.term.slice(0, 1)}
                </h3>
              </Badge>
              <Badge variant={"outline"}>
                <h3 className="text-lg font-bold ">
                  GPA: {calculateGpa(year.termQuery, year.totalCredit)}
                </h3>
              </Badge>
            </div>

            <DataTableStudentInfo
              columns={columns}
              data={transformedData}
              pagination={year.termQuery.length}
              onRowClick={(item: any) => handleRowClick(item.subject_name)}
            />
            <StudentPopup
              isOpen={isOpenPopUp}
              onClose={() => setIsOpenPopUp(false)}
              student={studentData}
              subjects={subjectDataByRowClick}
            />
          </div>
        );
      })}
    </div>
  );
}

export default StudentInfoByIdPage;
