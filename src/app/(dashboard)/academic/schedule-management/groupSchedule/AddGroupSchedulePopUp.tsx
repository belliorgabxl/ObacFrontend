import { fetchCreateScheduleSubject } from "@/api/oldApi/schedule/scheduleAPI";
// import { fetchGetAllStudentGroup } from "@/api/oldApi/student/studentApi";
import { fetchGetAllActiveSubject } from "@/api/oldApi/subject/subjectAPI";
import { fetchGetAllTeacherAsync } from "@/api/oldApi/teacher/teacherAPI";
import { CreateScheduleSubjectRequest } from "@/dto/schedule";
// import { StudentGroup } from "@/dto/studentDto";
import { GetAllSubject } from "@/dto/subjectDto";
import { GetAllTeacher } from "@/dto/teacherDto";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

type AddSchedulePopUp = {
  onClosePopUp: (value: boolean) => void;
  term: string;
  year: string;
  groupId: number;
  groupName: string;
};

interface TeacherOption {
  value: string;
  label: string;
}
const getAllSubject = async () => {
  try {
    const response = await fetchGetAllActiveSubject();
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

export default function AddGroupSchedulePopUp({
  onClosePopUp,
  term,
  year,
  groupId,
  groupName,
}: AddSchedulePopUp) {
  const [subjects, setSubject] = useState<GetAllSubject[]>([]);
  const [teachers, setTeacher] = useState<GetAllTeacher[]>([]);

  useEffect(() => {
    getAllSubject().then((item) => {
      setSubject(item);
    });
    getAllTeacher().then((item) => {
      setTeacher(item);
    });
  }, []);

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

  const subjectOptions = subjects.map((item) => ({
    value: item.id,
    label: `${item.subjectCode} : ${item.subjectName}`,
  }));

  const handleSubjectChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      const selectedSubject = subjects.find(
        (sub) => sub.id === selectedOption.value
      );
      if (selectedSubject) {
        setSubjectID(selectedSubject.id);
      }
    } else {
      setSubjectID(0);
    }
  };

  const handleTeacherChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      const selectedTeacher = teachers.find(
        (sub) => sub.teacherId === selectedOption.value
      );
      if (selectedTeacher) {
        setTeacherID(selectedTeacher.teacherId);
      }
    } else {
      setTeacherID(0);
    }
  };

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.teacherId,
    label: `${teacher.teacherCode} : ${teacher.thaiName} ${teacher.thaiLastName}`,
  }));

  const onSubmit = async () => {
    const requestBody: CreateScheduleSubjectRequest = {
      day: day,
      period: period,
      subject_id: subjectID,
      year: Number(year),
      term: term,
      student_group_id: Number(groupId),
      teacher_id: teacherID,
      room: room,
    };

    try {
      // console.log("data : ", requestBody);
      const response = await fetchCreateScheduleSubject(requestBody);
      if (response.success) {
        toast.success("สร้างสำเร็จ");
        onClosePopUp(false);
        setTimeout(() => {}, 2000);
        window.location.reload();
      } else {
        toast.error(`สร้างไม่สำเร็จ: ${response.error}`);
      }
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
        <div className="py-2 text-center text-xl text-gray-900 rounded-t-lg bg-white w-full">
          เพิ่มวิชาสอน
        </div>
        <div className="px-10 py-5">
          <div className="flex justify-start gap-4">
            <span className="flex gap-2 justify-center">
              <label className="py-1 px-2 ">วัน</label>
              <select
                className="px-5 py-1 rounded-md bg-gray-50 border border-gray-300 focus:outline-blue-500 "
                onChange={(e) => setDay(e.target.value)}
                value={day}
              >
                <option value="">- เลือก -</option>
                {days.map((items) => (
                  <option key={items} value={items}>
                    {items}
                  </option>
                ))}
              </select>
            </span>
            <span className="flex gap-2 justify-start">
              <label className="py-1 px-2">คาบเรียน</label>
              <select
                className="rounded-md px-5 py-1 bg-gray-50 border border-gray-300 focus:outline-blue-500 "
                onChange={(e) => setPeriod(e.target.value)}
                value={period}
              >
                <option value="">- เลือก -</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="3">4</option>
                <option value="3">5</option>
              </select>
            </span>
          </div>
          <div className=" my-3 grid gap-1 ">
            <label className="py-1">วิชาเรียน </label>
            <div className="w-[350px]">
              <Select
                options={subjectOptions}
                value={subjectOptions.find(
                  (option) => option.value === subjectID || null
                )}
                onChange={handleSubjectChange}
                isSearchable
                placeholder="-- เลือกวิชา --"
              />
            </div>
          </div>

          <div className=" my-3 grid gap-1 ">
            <label className="py-1">อาจารย์ผู้สอน </label>
            <div className="w-[350px]">
              <Select
                options={teacherOptions}
                value={
                  teacherOptions.find((option) => option.value === teacherID) ||
                  null
                }
                onChange={handleTeacherChange}
                isSearchable
                placeholder="-- เลือกอาจารย์ผู้สอน --"
              />
            </div>
          </div>
          <div className="my-4">
            <span className="flex items-center  justify-start gap-5 ">
              <div className="flex gap-2">
                <label className="py-1  ">ห้องเรียน</label>
                <input
                  type="text"
                  className="w-[100px] focus:outline-blue-400 border-[1px] rounded-md border-gray-300 px-4 py-1"
                  placeholder="room"
                  onChange={(e) => setRoom(e.target.value)}
                  value={room}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="py-1 ">กลุ่มเรียน</label>
                <p className="px-4 py-1 rounded-sm border border-gray-300">
                  {groupName}
                </p>
              </div>
            </span>
          </div>

          <div className="flex justify-center gap-5 ">
            <button
              className="px-8 text-white py-1 hover:bg-gray-300 hover:text-black bg-gray-400 rounded-sm"
              onClick={() => onClosePopUp(false)}
            >
              ยกเลิก
            </button>{" "}
            <button
              className="px-8 text-white py-1 bg-blue-500 rounded-sm hover:bg-blue-600"
              disabled={!period || !day || !room || !teacherID || !subjectID}
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
