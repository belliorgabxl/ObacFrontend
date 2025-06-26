"use client";

import { Combobox } from "@/components/common/Combobox/combobox";
import { useEffect, useMemo, useState } from "react";
import { getGroupSummaryGradeViewData } from "@/resource/academics/grading/viewData/classroomByGroupIdViewData";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/common/MainTable/table_style_1";
import { ConvertClassroomGradingToExcel } from "@/lib/convertToExcel";
import { useRouter } from "next/navigation";
import TotalScoreInGroup, {
  DataList,
} from "@/lib/PDF/TotalScoreInGroup";
import { Boxes, Download, Loader2 } from "lucide-react";
import { fetchGetStudentGradeDetail } from "@/api/oldApi/grad/gradAPI";
import { toast } from "react-toastify";
import { GetStudentGradeDetailDto } from "@/dto/gradDto";
import GroupSummaryGradPDF from "@/lib/PDF/GroupSummaryGrade";

export interface GeneralData {
  groupId: number;
  groupName: string;
  groupCode: string;
  class: string;
  facultyName: string;
  programName: string;
  term: string;
  year: number;
}

export interface StudentList {
  studentId: number;
  studentCode: string;
  name: string;
  gpa: number;
  gpax: number;
  totalCredit: number;
  subjects: Record<string, string>;
}

export interface StudentInRowClick {
  studentId: number;
  studentCode: string;
  name: string;
  gpa: number;
  gpax: number;
  totalCredit: number;
  subjects: Record<string, string>;
}

export interface GroupSummaryGradeResponse {
  generalData: GeneralData;
  students: StudentList[];
  subjects: string[];
}

interface IndividualStudentInfoData {
  studentId: number;
  studentName: string;
}

const ClassroomByGroupId = ({ params }: { params: { params: string[] } }) => {
  const rounter = useRouter();
  // data.groupId, data.term, data.year;
  const groupId = params.params[0];
  const term = params.params[1];
  const year = params.params[2];

  const [summaryData, setSummaryData] =
    useState<GroupSummaryGradeResponse | null>(null);

  const [selectedGPA, setSelectedGPA] = useState<string>("");
  const [selectedGPAX, setSelectedGPAX] = useState<string>("");
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [gropDownLoadPDFTrigger, setGropDownLoadPDFTrigger] =
    useState<boolean>(false);

  // filter data
  const filteredData = useMemo(() => {
    if (!summaryData) return [];

    const filtered = summaryData.students.filter((student) => {
      const matchGPA = selectedGPA
        ? student.gpa >= parseFloat(selectedGPA.split("-")[0]) &&
          student.gpa <= parseFloat(selectedGPA.split("-")[1])
        : true;
      const matchGPAX = selectedGPAX
        ? student.gpax >= parseFloat(selectedGPAX.split("-")[0]) &&
          student.gpax <= parseFloat(selectedGPAX.split("-")[1])
        : true;

      return matchGPA && matchGPAX;
    });

    return filtered.sort((a, b) => Number(a.studentCode) - Number(b.studentCode));
  }, [summaryData, selectedGPA, selectedGPAX]);

  // get data from api
  useEffect(() => {
    const fetchData = async () => {
      const result = await getGroupSummaryGradeViewData(
        Number(groupId),
        term,
        year
      );
      setSummaryData(result);
      setIsLoadingPage(true);
    };
    fetchData();
  }, []);

  const baseColumns = [
    { label: "ลำดับ", key: "index", className: "w-1/16 justify-center" },
    { label: "รหัสนักศึกษา", key: "studentCode", className: "w-2/16" },
    { label: "ชื่อ-นามสกุล", key: "name", className: "w-2/16 text-start" },
  ];

  const subjectColumns = Array.from({ length: 10 }, (_, index) => {
    if (summaryData?.subjects && index < summaryData.subjects.length) {
      return {
        label: summaryData.subjects[index],
        key: summaryData.subjects[index],
        className: "w-1/16 justify-center overflow-hidden",
      };
    } else {
      return {
        label: "",
        key: `empty_${index}`,
        className: "w-1/16 justify-center",
      };
    }
  });

  const GradeColumns = [
    { label: "เฉลี่ย", key: "gpa", className: "w-1/16 justify-center" },
    { label: "เฉลี่ยสะสม", key: "gpax", className: "w-1/16 justify-center" },
  ];
  const finalColumns = [
    ...baseColumns,
    ...(subjectColumns ?? []),
    ...GradeColumns,
  ];

  const handleExportToExcel = async () => {
    if (summaryData) {
      ConvertClassroomGradingToExcel(
        summaryData.generalData,
        summaryData.students
      );
    } else {
      console.error("Summary data is not available");
    }
  };
  // const onRowClick = (studentCode: string) => {
  //   const studentData: IndividualStudentInfoData = {
  //     studentId:
  //       summaryData?.students.find(
  //         (student) => student.studentCode === studentCode
  //       )?.studentId || 0,
  //     studentName:
  //       summaryData?.students.find(
  //         (student) => student.studentCode === studentCode
  //       )?.name || "",
  //   };

  //   rounter.push(`/academic/score/management/individual`);
  // };

  const convertTOPDFData: DataList = {
    generalData: summaryData?.generalData
      ? {
          groupId: summaryData.generalData.groupId,
          groupName: summaryData.generalData.groupName,
          groupCode: summaryData.generalData.groupCode,
          class: summaryData.generalData.class,
          facultyName: summaryData.generalData.facultyName,
          programName: summaryData.generalData.programName,
          term: summaryData.generalData.term,
          year: summaryData.generalData.year,
        }
      : {
          groupId: 0,
          groupName: "",
          groupCode: "",
          class: "",
          facultyName: "",
          programName: "",
          term: "",
          year: 0,
        },
    studentList: summaryData?.students || [],
  };
  const handleDownLoadAllStudentGradDetailPDF = async () => {
    setGropDownLoadPDFTrigger(true);
    if (!summaryData || summaryData.students.length === 0) {
      toast.error("ไม่พบข้อมูลนักศึกษา");
      return;
    }
    try {
      const studentDataPromises = summaryData.students.map((student) =>
        fetchGetStudentGradeDetail(student.studentId)
      );

      const studentDataList = await Promise.all(studentDataPromises);
      const validStudentDataList = studentDataList.filter(
        (data) => data !== null
      ) as GetStudentGradeDetailDto[];

      if (validStudentDataList.length === 0) {
        toast.error("ไม่มีข้อมูลนักศึกษาที่สามารถดาวน์โหลดได้");
        return;
      }

      for (const data of validStudentDataList) {
        const pdfBlob = await GroupSummaryGradPDF(data);
        if (!pdfBlob) {
          console.error(`PDF generation failed for student: ${data.studentId}`);
          continue;
        }

        const url = window.URL.createObjectURL(new Blob([pdfBlob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `ใบแสดงผล ${data.thaiName} ${data.studentCode}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setGropDownLoadPDFTrigger(false);
      toast.success("ดาวน์โหลด PDF สำเร็จทั้งหมด!");
    } catch (error) {
      console.error("Error downloading PDFs:", error);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ PDF");
    }
  };

  return (
    <>
      {isLoadingPage ? (
        <header className="flex flex-col mx-4 sm:mx-10 lg:mx-10 p-4  rounded-lg">
          <div className="w-full flex justify-start ">
            <div className="px-10 rounded-3xl flex gap-2 items-center  py-2 border border-gray-100 shadow-md   text-blue-700 text-xl w-fit">
              <Boxes className="h-8 w-8" />
              จัดการคะแนน (ห้องเรียน)
            </div>
          </div>
          {/* filter classroom have a name , gpa filter 0-4 , gpax filter */}
          <div className="flex py-2  justify-between">
           <div className="border h-fit w-fit border-gray-200 rounded-full px-10 py-1 ">
              <h1 className="text-xl">
                สรุปการศึกษา ภาคเรียนที่ {term} ปีการศึกษา {year} ห้องเรียน{" "}
                {summaryData?.generalData.class}.
                {summaryData?.generalData.groupName}{" "}
              </h1>
              </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    TotalScoreInGroup(convertTOPDFData);
                  }}
                  className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 shadow-slate-300 shadow-sm rounded-full px-5 py-1 h-fit "
                >
                  <Download className="w-4 h-4" />
                  ใบตรวจเกรด {summaryData?.generalData.class}.
                  {summaryData?.generalData.groupName} .pdf
                </button>
                <button
                  onClick={handleExportToExcel}
                  className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 shadow-slate-300 shadow-sm rounded-full px-5 py-1 h-fit "
                >
                <Download className="w-4 h-4" />
                  เกรดนักเรียนห้อง {summaryData?.generalData.class}.
                  {summaryData?.generalData.groupName} Excel
                </button>
              </div>
              <div className="flex gap-2 items-center justify-end">
                <button
                 className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 shadow-slate-300 shadow-sm rounded-full px-5 py-1 h-fit "
                  onClick={handleDownLoadAllStudentGradDetailPDF}
                >
                  <Download className="w-4 h-4" />
                  {gropDownLoadPDFTrigger ? (
                    <p className="flex gap-2 itemc-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      ใบแสดงผลการเรียน
                    </p>
                  ) : (
                    <p>ใบแสดงผลการเรียน {summaryData?.students.length} คน</p>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="w-1/6 ">
              <Combobox
                buttonLabel="GPA"
                options={[
                  { label: "0 - 1", value: "0-1" },
                  { label: "1 - 2", value: "1-2" },
                  { label: "2 - 3", value: "2-3" },
                  { label: "3 - 4", value: "3-4" },
                ]}
                onSelect={(value) => setSelectedGPA(value)}
              />
            </div>
            <div className="w-1/6">
              <Combobox
                buttonLabel="GPAX "
                options={[
                  { label: "0 - 1", value: "0-1" },
                  { label: "1 - 2", value: "1-2" },
                  { label: "2 - 3", value: "2-3" },
                  { label: "3 - 4", value: "3-4" },
                ]}
                onSelect={(value) => setSelectedGPAX(value)}
              />
            </div>
          </div>
          <div className="">
            <DataTable
              columns={finalColumns}
              data={
                filteredData.map((student, index) => ({
                  index: index + 1,
                  studentCode: student.studentCode,
                  name: student.name,
                  gpa: student.gpa.toFixed(2),
                  gpax: student.gpax.toFixed(2),
                  ...student.subjects,
                })) || []
              }
              getRowLink={(student) => {
                //find a student by studentCode
                const studentData = summaryData?.students.find(
                  (studentData) =>
                    studentData.studentCode === student.studentCode
                );

                return `/academic/score-management/individual/${studentData?.studentId}`;
              }}
              pagination={summaryData?.students.length || 0}
            />
          </div>
        </header>
      ) : (
        <div className="mt-2 border-2 border-dashed rounded-md border-gray-400 grid place-items-center py-20 text-3xl text-blue-400 font-semibold items-center">
          <p className="flex gap-2">
            <Loader2 className="h-10 w-10 animate-spin" />
            Loading...
          </p>
        </div>
      )}
    </>
  );
};

export default ClassroomByGroupId;
