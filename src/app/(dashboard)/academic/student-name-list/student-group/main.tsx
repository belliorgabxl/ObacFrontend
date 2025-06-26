"use client";
import { GetStudentListByGroupID } from "@/api/oldApi/student/studentApi";
import StudentNameListPDF from "@/lib/PDF/StudentNameList";
import {
  GetStudentListByGroupIDDto,
  StudentListByGroupIDDto,
} from "@/dto/studentDto";
import { ConvertClassroomToExcel } from "@/lib/convertToExcel";
import { Download, Loader2, UsersRound } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  groupId: number;
};

const getStudentDataList = async (groupId: number) => {
  try {
    const response = await GetStudentListByGroupID(groupId);
    return response;
  } catch (err) {
    return [];
  }
};

export default function Main({ groupId }: Props) {
  const [studentInGroup, setStudentInGroup] =
    useState<GetStudentListByGroupIDDto | null>();
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const dateTime = new Date();
  const currentMonth = dateTime.getMonth(); 
  const year = currentMonth > 5 
  ? dateTime.getFullYear() + 543 
  : dateTime.getFullYear() + 543 - 1;
  useEffect(() => {
    setIsLoadingPage(false);
    getStudentDataList(groupId).then(
      (item: GetStudentListByGroupIDDto | never[] | null) => {
        if (item && !Array.isArray(item)) {
          setStudentInGroup(item);
          setIsLoadingPage(true);
        } else {
          setStudentInGroup(null);
          setIsLoadingPage(true);
        }
      }
    );
  }, [groupId]);

  const onGetStudentNameListPDF = () => {
    if (studentInGroup) {
      const studentClass =
        studentInGroup?.class + "." + studentInGroup?.groupName;
        const filteredStudents = studentInGroup.students.filter(
          (student) =>
            !["คัดชื่อออก", "พักการเรียน", "ลาออก"].includes(student.studentStatus)
        );
      StudentNameListPDF({
        studentGroup: studentClass,
        student: filteredStudents,
        year: year,
      });
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const item = await getStudentDataList(groupId);

      if (item && !Array.isArray(item)) {
        setStudentInGroup(item);
      } else {
        setStudentInGroup(null);
      }

      if (item && !Array.isArray(item)) {
        const studentClass = item.class + "." + item.groupName;
        const filteredStudents = item.students.filter(
          (student) =>
            !["คัดชื่อออก", "พักการเรียน", "ลาออก"].includes(student.studentStatus)
        );
        ConvertClassroomToExcel(filteredStudents, studentClass);
      } else {
        alert("No student data available for this group.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to fetch student data. Please try again.");
    }
  };
  return (
    <div className="py-2 w-full px-10">
      <div className="flex px-5 justify-start py-3 items-center">
        <h1 className="px-10 py-2 rounded-3xl  text-xl w-fit border border-gray-100 shadow-md   text-blue-700 flex gap-2 items-center">
          <UsersRound className="h-8 w-8" />
          รายชื่อนักเรียนในห้องเรียน
        </h1>
      </div>
      <div className="flex justify-between items-center py-2 px-5">
        <div className=" flex gap-3 items-center text-lg">
          <div className="border border-gray-300 rounded-sm px-5 py-1">
            ห้อง {studentInGroup?.class}.{studentInGroup?.groupName}
          </div>
          <div className="border border-gray-300 rounded-sm px-5 py-1">
            หลักสูตร {studentInGroup?.facultyName}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 shadow-slate-300 shadow-sm rounded-full px-5 py-1 h-fit "
            onClick={onGetStudentNameListPDF}
          >
            <Download className="w-4 h-4" />
            ใบรายชื่อนักเรียน PDF
          </button>
          <button
            className="text-sm items-center flex justify-center gap-2  bg-[#e4f1f8] text-gray-700 hover:bg-gray-200 shadow-slate-300 shadow-sm rounded-full px-5 py-1 h-fit "
            onClick={handleDownloadExcel}
          >
            <Download className="w-4 h-4" />
            ใบรายชื่อนักเรียน Excel
          </button>
        </div>
      </div>
      {isLoadingPage ? (
        <div className="w-full px-5 pb-10">
          <div className="w-full shadow-lg grid grid-cols-[5%_10%_30%_55%]  bg-white border-t-2 border-b-2 text-lg border-gray-400">
            <div className="text-center py-2">ลำดับ</div>
            <div className="text-center py-2">รหัสนักเรียน</div>
            <div className="text-center py-2">ชื่อ - นามสกุล</div>
            <div className="text-center py-2">สถานะ</div>
          </div>
          {studentInGroup ? (
            <div className="w-full shadow-lg">
              {studentInGroup.students?.map(
                (item: StudentListByGroupIDDto, index) => (
                  <Link
                    href={`/academic/student-details/${item.studentId}`}
                    key={index}
                    className={` ${
                      index % 2 == 0 ? "bg-white" : ""
                    } grid grid-cols-[5%_10%_15%_15%_55%]  border border-r-0 border-l-0 text-[16px] hover:bg-blue-100 border-gray-300 text-gray-700  border-t-0`}
                  >
                    <div className="text-center flex items-center w-full justify-center text-gray-700 border-r py-1  border-gray-300">
                      {index + 1}
                    </div>
                    <p className="text-start flex items-center px-4 border-r border-gray-300   py-1 line-clamp-1">
                      {item.studentCode}
                    </p>
                    {item.gender == "Male" ? (
                      <p className="text-start flex items-center  px-4  py-1 line-clamp-1">
                        นาย&nbsp;&nbsp;
                        {item.firstName}
                      </p>
                    ) : (
                      <p className="text-start flex items-center  px-4  py-1 line-clamp-1">
                        นางสาว&nbsp;&nbsp;{item.firstName}
                      </p>
                    )}

                    <p className="text-start flex items-center  px-4 border-r border-gray-300  py-1 line-clamp-1">
                      {item.lastName}
                    </p>
                    <p
                      className={`${
                        item.studentStatus == "กำลังศึกษา"
                          ? "text-green-500"
                          : item.studentStatus == "พักการเรียน"
                          ? "text-yellow-600 bg-yellow-50"
                          : item.studentStatus == "ลาออก"
                          ? "text-red-500 bg-red-50"
                          : "text-blue-500"
                      } text-center  px-4  border-gray-300  py-1 line-clamp-1`}
                    >
                      {item.studentStatus}
                    </p>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="grid place-items-center border-2 border-dashed border-t-0 text-[24px] border-gray-400  text-gray-700 py-10 text-center">
              ไม่พบข้อมูล
            </div>
          )}
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
}
