"use client";
import GenStudentNameInSubject from "@/lib/PDF/genStudentNameInSubject";
import GenSubjectScore from "@/lib/PDF/genSubjectScore";
import {
  ConvertGradBySubjectId,
  GetGradBySubjectId,
} from "@/dto/gradDto";
import { GetScheduleBysubjectId } from "@/dto/schedule";
import { GetSubjectBySubjectId } from "@/dto/subjectDto";
import { ConvertScoreToExcel } from "@/lib/convertToExcel";
import { CircleX, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { MethodDto } from "@/dto/methodDto";

interface Props {
  grads?: GetGradBySubjectId[];
  schedules?: GetScheduleBysubjectId[];
  subjects: GetSubjectBySubjectId;
  method: MethodDto;
  className:string;
  isComplete: string;
  onEditReturn: (data: boolean) => void;
}

export default function MenuBar({
  schedules,
  grads,
  subjects,
  method,
  isComplete,
  className,
  onEditReturn,
}: Props) {
  const [gradData, setGradData] = useState<GetGradBySubjectId[]>([]);
  const [scheduleData, setSchedules] = useState<
    GetScheduleBysubjectId[] | null
  >(null);
  const [subjectData, setSubject] = useState<GetSubjectBySubjectId | null>(
    null
  );
  const [onEdit, setOnEdit] = useState<boolean>(false);

  useEffect(() => {
    setGradData(grads ?? []);
  }, [grads]);

  useEffect(() => {
    setSchedules(schedules ?? null);
    setSubject(subjects ?? null);
  }, [schedules, subjects]);

  const student_group_list = gradData.map((item) => item.studentGroup);
  const student_group = student_group_list[0];

  const handleEditChange = () => {
    onEditReturn(true);
    setOnEdit(true);
  };

  const handleEditOff = () => {
    onEditReturn(false);
    setOnEdit(false);
  };

  const [convertGrad, setConvertGrad] = useState<ConvertGradBySubjectId[]>([]);

  const handleConvert = () => {
    const convertedData: ConvertGradBySubjectId[] = gradData.map((item) => ({
      studentCode: item.studentCode,
      name: `${item.firstName} ${item.lastName}`,
      collectScore: item.collectScore ?? 0,
      testScore: item.testScore ?? 0,
      affectiveScore: item.affectiveScore ?? 0,
      totalScore: item.totalScore ?? 0,
    }));
    return convertedData;
  };

  useEffect(() => {
    setConvertGrad(handleConvert());
  }, [gradData]);

  return (
    <div className="bg-white  ">
      <div className="flex justify-between h-fit">
        <div className="grid gap-2 rounded-md bg-white px-10 text-gray-600 bg-gradient-to-tr from-sky-200 to-teal-100 py-3 ">
          <div className="flex items-center gap-4">
            <span className=" text-xl">
              รหัสวิชา : {subjectData?.subjectCode}
            </span>
            <span className="text-md text-gray-500 font-semibold bg-white rounded-sm text-center py-1 w-fit px-2">
              กลุ่มเรียน : {className}.{student_group}{" "}
            </span>
          </div>

          <div className="text-2xl rounded-md ">
            วิชา : {subjectData?.subjectName}
          </div>
        </div>
        <div className="grid h-fit gap-2 p-2">
          <div className="flex justify-end gap-3">
            <button
              disabled={!student_group}
              className="text-md bg-[#e4f1f8] text-gray-600 hover:bg-gray-200 rounded-md px-5 py-2"
              onClick={() => {
                GenSubjectScore({
                  grads: grads,
                  studentGroup: `${className}.${student_group}`,
                  subjectId: subjectData?.subjectCode,
                  subjectName: subjectData?.subjectName,
                });
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดใบคะแนน</p>
            </button>
            <button
              className=" text-md text-gray-600 hover:bg-gray-200 bg-[#e4f1f8] rounded-md px-5 py-2"
              onClick={() => {
                GenStudentNameInSubject({
                  grads: grads,
                  studentGroup: `${className}.${student_group}`,
                  subjectId: subjectData?.subjectCode,
                  subjectName: subjectData?.subjectName,
                });
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดรายชื่อนักเรียน</p>
            </button>
          </div>
          <div className="flex justify-end items-center gap-3 ">
            <button
              className=" text-md text-gray-600 hover:bg-gray-200 bg-[#e4f1f8] rounded-md px-5 py-2"
              onClick={async () => {
                ConvertScoreToExcel(
                  convertGrad,
                  scheduleData?.[0].term?.toString() || "",
                  scheduleData?.[0].year?.toString() || "",
                  subjectData?.subjectCode || "",
                  subjectData?.subjectName || "",
                  student_group || ""
                );
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดใบคะแนนนักเรียน excel</p>
            </button>
            {onEdit ? (
              <button
                className={`bg-red-500 duration-300 text-white h-fit text-center text-lg rounded-md hover:opacity-75 flex items-center justify-center gap-2 w-[120px] py-1 hover:rounded-sm `}
                onClick={handleEditOff}
              >
                ยกเลิก
                <CircleX
                  style={{ width: "1.0rem", height: "1.5rem" }}
                  className="text-white"
                />
              </button>
            ) : (
              <div>
                {method.isActive && isComplete == "false" ? (
                  <button
                    className={`bg-blue-400 duration-300 h-fit text-white text-lg rounded-md hover:opacity-75 w-[120px] gap-2 flex items-center justify-center text-center py-1 hover:rounded-sm `}
                    onClick={handleEditChange}
                  >
                    แก้ไข
                    <Pencil
                      style={{ width: "1.0rem", height: "1.5rem" }}
                      className="text-white "
                    />
                  </button>
                ) : (
                  <div className="text-sm bg-gray-600 text-white py-1.5 rounded-sm px-10">
                    Closed
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
