import { fetchCreateScheduleSubject } from "@/api/oldApi/schedule/scheduleAPI";
import { fetchGetStudentGroupsByTermYear } from "@/api/oldApi/student/studentApi";
import { fetchGetAllSubjectByTerm } from "@/api/oldApi/subject/subjectAPI";
import { fetchGetAllTeacherAsync } from "@/api/oldApi/teacher/teacherAPI";
import { Input } from "@/components/ui/input";
import { CreateScheduleSubjectRequest } from "@/dto/schedule";
import { GetStudentGroupsByTermYearDto } from "@/dto/studentDto";
import { GetAllSubject } from "@/dto/subjectDto";
import { GetAllTeacher } from "@/dto/teacherDto";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

type AddSchedulePopUp = {
  onClosePopUp: (value: boolean) => void;
  year: string;
};

interface SubjectOption {
  value: number;
  label: string;
}
const getAllSubjectByTerm = async (term: number) => {
  try {
    const response = await fetchGetAllSubjectByTerm(term);
    return response;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllTeacher = async () => {
  try {
    const response = await fetchGetAllTeacherAsync();
    return response;
  } catch (err) {
    return [];
  }
};

const GetStudentGroupsByTermYear = async (term: string, year: number) => {
  try {
    const response = await fetchGetStudentGroupsByTermYear(term, year);
    return response;
  } catch (err) {
    return [];
  }
};

export default function AddSchedulePopUp({
  onClosePopUp,
  year,
}: AddSchedulePopUp) {
  const [subjects, setSubject] = useState<GetAllSubject[]>([]);
  const [teachers, setTeacher] = useState<GetAllTeacher[]>([]);
  const [studentGroup, setStudentGroup] = useState<
    GetStudentGroupsByTermYearDto[]
  >([]);
  const term = ["1", "2"];
  const currentYear = new Date().getFullYear() - 1 + 543;
  const yearsList = Array.from({ length: 3 }, (_, i) =>
    (currentYear - i).toString()
  );
  const [selectedTerm, setSelectedTerm] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  useEffect(() => {
    getAllTeacher().then((item) => {
      setTeacher(item);
    });
    GetStudentGroupsByTermYear(selectedTerm, Number(selectedYear)).then(
      (item: any) => {
        setStudentGroup(item);
      }
    );
  }, []);

  useEffect(() => {
    GetStudentGroupsByTermYear(selectedTerm, Number(selectedYear)).then(
      (item: any) => {
        setStudentGroup(item);
      }
    );
  }, [selectedTerm, selectedYear]);

  useEffect(() => {
    const studentGroupById = studentGroup.find(
      (item) => item.groupId === studentGroupId
    );
    getAllSubjectByTerm(parseInt(selectedTerm)).then((item) => {
      setSubject(item);
    });
  }, [selectedTerm]);

  const days = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
  ];
  const [day, setDay] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [teacherID, setTeacherID] = useState<number>(0);
  const [subjectID, setSubjectID] = useState<number>(0);
  const [studentGroupId, setStudentGroupId] = useState<number>(0);

  const subjectOptions: SubjectOption[] = subjects.map((item) => ({
    value: item.id,
    label: `${item.subjectCode} : ${item.subjectName}`,
  }));

  const teacherOptions = teachers.map((teacher, index) => ({
    value: teacher.teacherId,
    label: `${teacher.teacherCode ?? `${index + 1}`} : ${teacher.thaiName} ${
      teacher.thaiLastName
    }`,
  }));

  const groupOptions = studentGroup.map((item) => ({
    value: item.groupId,
    label: `${item.class}.${item.groupName}`,
  }));

  const onSubmit = async () => {
    const studentGroupById = studentGroup.find(
      (item) => item.groupId === studentGroupId
    );
    const studentGroupName = studentGroupById?.groupName;
    const requestBody: CreateScheduleSubjectRequest = {
      day: day,
      period: period,
      subject_id: subjectID,
      year: Number(year),
      term: selectedTerm,
      student_group_id: studentGroupId,
      teacher_id: teacherID,
      room: room,
    };

    try {
      const response = await fetchCreateScheduleSubject(requestBody);
      if (response.success) {
        toast.success("สร้างสำเร็จ");
        setTeacherID(0);
        setSubjectID(0);
        setStudentGroupId(0);
        setDay("");
        setRoom("");
        onClosePopUp(false);
      } else {
        toast.error(`สร้างไม่สำเร็จ: ${response.error}`);
      }
      onClosePopUp(false);
    } catch (err) {
      console.error("Error creating schedule:", err);
    }
  };

  return (
    <div
      className="fixed duration-1000 animate-appearance inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
      onClick={() => onClosePopUp(false)}
    >
      <div
        className=" bg-white shadow-lg shadow-gray-400   rounded-lg w-4/12 z-100 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-5">
          <div className="py-2 text-center text-xl text-gray-900 rounded-t-lg bg-white w-full">
            เพิ่มวิชาสอน
          </div>
          <div className="flex  px-4 py-2">
            <div className="w-full flex flex-col p-2 relative">
              <h1>ภาคเรียน</h1>
              <Select
                options={term.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  selectedTerm
                    ? { value: selectedTerm, label: selectedTerm }
                    : null
                }
                onChange={(selectedOption) =>
                  setSelectedTerm(selectedOption?.value || "")
                }
              />
            </div>
            <div className="w-full flex flex-col p-2 relative">
              <h1>ปีการศึกษา</h1>
              <Select
                options={yearsList.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  selectedYear
                    ? { value: selectedYear, label: selectedYear }
                    : null
                }
                onChange={(selectedOption) =>
                  setSelectedYear(selectedOption?.value || "")
                }
                placeholder="-- เลือกปีการศึกษา --"
              />
            </div>
          </div>
          <div className="flex px-4 py-2">
            <div className="w-full px-2">
              <h1>ห้องเรียน</h1>
              <Input
                type="text"
                placeholder="ห้องเรียน"
                className="w-full pr-10"
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div className="w-full">
              <h1>กลุ่มเรียน</h1>
              <Select
                options={groupOptions.map((item) => ({
                  value: item.value,
                  label: `${item.label} `,
                }))}
                value={
                  studentGroupId
                    ? groupOptions.find(
                        (item) => item.value === studentGroupId
                      ) || null
                    : null
                }
                onChange={(selectedOption) =>
                  setStudentGroupId(Number(selectedOption?.value || 0))
                }
                placeholder="-- เลือกกลุ่มเรียน --"
              />
            </div>
          </div>
          <div className="flex px-4 py-2">
            <div className="w-full px-2">
              <h1>วิชาเรียน</h1>
              <Select
                options={subjectOptions.map((item) => ({
                  value: item.value,
                  label: `${item.label}`,
                }))}
                value={
                  subjectID
                    ? subjectOptions.find(
                        (item) => item.value.toString() === subjectID.toString()
                      ) || null
                    : null
                }
                onChange={(selectedOption) =>
                  setSubjectID(Number(selectedOption?.value || 0))
                }
                placeholder="-- เลือกวิชา --"
              />
            </div>
          </div>
          <div className="flex  px-4 py-2">
            <div className="w-full flex flex-col  px-2 relative">
              <h1>วันที่สอน</h1>
              <Select
                options={days.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  day
                    ? {
                        value: day,
                        label: day,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setDay(selectedOption?.value || "")
                }
                placeholder="-- เลือกวันที่สอน --"
              />
            </div>
            <div className="w-full flex flex-col px-2 relative">
              <h1>คาบเรียน</h1>
              <Select
                options={["1", "2", "3", "4", "5"].map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  period
                    ? {
                        value: period,
                        label: period,
                      }
                    : null
                }
                onChange={(selectedOption) =>
                  setPeriod(selectedOption?.value || "")
                }
                placeholder="-- เลือกคาบเรียน --"
              />
            </div>
          </div>
          <div className="flex  px-4 py-2">
            <div className="w-full px-2">
              <h1>อาจารย์ผู้สอน</h1>
              <Select
                options={teacherOptions.map((item) => ({
                  value: item.value,
                  label: `${item.label} `,
                }))}
                value={
                  teacherID
                    ? teacherOptions.find((item) => item.value === teacherID)
                    : null
                }
                onChange={(selectedOption) =>
                  setTeacherID(Number(selectedOption?.value || 0))
                }
                placeholder="-- เลือกอาจารย์ผู้สอน --"
              />
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-4">
            <button
              className="px-8 text-white py-1 hover:bg-gray-300 hover:text-black bg-gray-400 rounded-sm"
              onClick={() => onClosePopUp(false)}
            >
              ยกเลิก
            </button>{" "}
            <button
              className="px-8 text-white py-1 bg-blue-500 rounded-sm hover:bg-blue-600"
              disabled={
                !period ||
                !day ||
                !room ||
                !teacherID ||
                !subjectID ||
                !studentGroup
              }
              onClick={onSubmit}
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
