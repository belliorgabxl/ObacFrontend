"use client";
import {
  fetchDeleteScheduleSubject,
  fetchGetScheduleOfTeacherByTeacherID,
} from "@/api/oldApi/schedule/scheduleAPI";
import { fetchGetTeacherByTeacherIdAsync } from "@/api/oldApi/teacher/teacherAPI";
import { TeacherScheduleSubject } from "@/dto/schedule";
import { GetTeacherByTeacherId } from "@/dto/teacherDto";
import { GraduationCap, PlusCircle } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import AddTeacherSchedulePopUp from "./AddTeacherSchedulePopUp";
import { toast } from "react-toastify";
type Props = {
  term: string;
  year: string;
  teacherID: string;
};

const getTeacherData = async (teacherId: string) => {
  try {
    const response = await fetchGetTeacherByTeacherIdAsync(Number(teacherId));
    return response;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getSchedule = async (teacherID: string, term: string, year: string) => {
  try {
    const data = await fetchGetScheduleOfTeacherByTeacherID(
      teacherID,
      Number(term),
      Number(year)
    );
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default function Form({ term, year, teacherID }: Props) {
  const [schedules, setSchedules] = useState<TeacherScheduleSubject[]>([]);
  const [teacherData, setTeacherData] = useState<GetTeacherByTeacherId>();
  const [scheduleBtn, setschduleBtn] = useState<boolean>(false);
  const [deleteTrigger, setDeleteTrigger] = useState<boolean>(false);
  const [deleteID, setDeleteID] = useState<number>(0);
  const [deleteName, setDeleteName] = useState<string>("");
  useEffect(() => {
    getSchedule(teacherID, term, year).then((d: any) => {
      setSchedules(d);
    });
    getTeacherData(teacherID).then((data: any) => {
      setTeacherData(data);
    });
  }, []);
  const thaiDaysOrder = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
  ];
  const sortedSchedules = [...schedules].sort((a, b) => {
    return thaiDaysOrder.indexOf(a.day) - thaiDaysOrder.indexOf(b.day);
  });
  const onDeleteSchedule = async (id: number, subjectName: string) => {
    const response = await fetchDeleteScheduleSubject(id);
    if (response.success) {
      toast.success(`ลบวิชา ${subjectName} สำเร็จ`);
      setDeleteTrigger(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error("ไม่สำเร็จ");
    }
  };

  return (
    <div className="w-full  px-10 ">
      <div className="pt-5 flex justify-start ">
        <h1 className="px-10 py-2 rounded-3xl  text-xl w-fit border border-gray-100 shadow-md   text-blue-700 flex gap-2 items-center">
          <GraduationCap className="h-8 w-8" />
          ตารางสอนอาจารย์
        </h1>
      </div>
      <div className="w-full py-5 flex justify-between items-start ">
        <div className=" rounded-md flex border group shadow-md shadow-gray-200 border-gray-200 w-fit px-5">
          <div className="overflow-hidden w-[100px] h-auto">
            <img
              src={teacherData?.teacherProfilePicture || "/asset/user.jpg"}
              className="w-[100px] h-auto group-hover:scale-[110%] duration-500  object-cover"
            />
          </div>
          <div className="grid h-fit px-4  py-2 gap-1 ">
            <div className="flex gap-2 text-[20px]">
              <p>{teacherData?.nameTitle}</p>
              <p>{teacherData?.thaiName}</p>
              <p>{teacherData?.thaiLastName}</p>
            </div>
            <div className="flex text-gray-700 gap-2 text-[16px]">
              เบอร์ติดต่อ :<p>{teacherData?.teacherPhone}</p>
            </div>
            <div className="flex text-gray-700 gap-2 text-[16px]">
              Email :<p>{teacherData?.teacherEmail}</p>
            </div>
          </div>
        </div>
        <div className="">
          {" "}
          <button
            className="px-10 py-1.5 flex gap-2 h-fit items-center bg-blue-500 hover:bg-blue-600 text-white rounded-3xl"
            onClick={() => setschduleBtn(true)}
          >
            <PlusCircle className="w-5 h-5 text-white  " />
            เพิ่มตารางเรียน
          </button>
        </div>
      </div>

      <div className="w-full ">
        <div className="w-full shadow-lg grid grid-cols-[10%_35%_10%_10%_10%_10%_10%_5%]  bg-white border-t-2 border-b-2 text-lg border-gray-400">
          <div className="text-center  py-2 ">รหัสวิชา</div>
          <div className="text-center  py-2 ">ชื่อวิชา</div>
          <div className="text-center  py-2 ">สายชั้น</div>
          <div className="text-center  py-2 ">ห้องเรียน</div>
          <div className="text-center  py-2 ">หน่วยกิต</div>
          <div className="text-center  py-2 ">คาบเรียน</div>
          <div className="text-center  py-2  ">วันสอน</div>
          <div className="text-center  py-2 "></div>
        </div>
      </div>
      {sortedSchedules.length > 0 ? (
        <div>
          {sortedSchedules?.map((item: TeacherScheduleSubject, index) => (
            <div key={index} className="shadow-md">
              {item.scheduleSubjects.map((subject, subIndex) => (
                <div
                  key={subIndex}
                  className={` ${
                    subIndex % 2 == 0 ? "bg-white" : "bg-white"
                  } grid grid-cols-[10%_35%_10%_10%_10%_10%_10%_5%]  border text-[16px] border-gray-300 text-gray-700  border-t-0`}
                >
                  <p className="text-start flex items-center px-4 border-r border-gray-300   py-1 line-clamp-1">
                    {subject.subjectCode}
                  </p>
                  <p className="text-start flex items-center  px-4 border-r border-gray-300  py-1 line-clamp-1">
                    {subject.subjectName}
                  </p>
                  <p className="text-center flex items-center justify-center border-r border-gray-300">
                    {subject.class}.{subject.groupName}
                  </p>
                  <p className="text-center flex items-center justify-center border-r border-gray-300">
                    {subject.room}
                  </p>
                  <p className="text-center flex items-center justify-center border-r border-gray-300">
                    {subject.credit}
                  </p>
                  <p className="text-center flex items-center justify-center border-r border-gray-300">
                    {subject.period}
                  </p>
                  <p className="text-center py-1 flex items-center justify-center  border-r  border-gray-300  ">
                    {subject.day}
                  </p>
                  <div className="text-center py-1 flex items-center justify-center  ">
                    <p
                      onClick={() => {
                        setDeleteTrigger(true);
                        setDeleteID(subject.id);
                        setDeleteName(subject.subjectName);
                      }}
                      className="px-4 py-1 bg-red-400 text-white rounded-sm hover:bg-red-600"
                    >
                      ลบ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center border-2 border-dashed border-t-0 text-[24px] border-gray-400  text-gray-600 py-10 text-center">
          ไม่มีตารางเรียน
        </div>
      )}

      {deleteTrigger && (
        <div
          className="fixed duration-1000 animate-appearance inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
          onClick={() => setDeleteTrigger(false)}
        >
          <div
            className="bg-white shadow-lg shadow-gray-400   rounded-lg w-[400px] z-100 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-4 w-full text-center text-2xl font-semibold">
              ยืนยันการลบ
            </div>
            <div className="grid place-items-center py-3">
              <p className="w-[300px] text-center">ลบวิชา {deleteName}</p>
              <p className="text-gray-600 w-[300px] text-center">
                ตรวจสอบให้แน่ใจก่อนลบ
              </p>
            </div>
            <div className="flex gap-5 justify-center py-5 w-full">
              <button
                className="text-sm w-[90px] py-1.5 bg-gray-300 hover:bg-gray-400 rounded-md text-black "
                onClick={() => setDeleteTrigger(false)}
              >
                ยกเลิก
              </button>
              <button
                className="text-sm w-[90px] py-1.5 bg-red-500 hover:bg-red-600 rounded-md text-white "
                onClick={() => {
                  onDeleteSchedule(deleteID, deleteName);
                }}
                disabled={!deleteID || !deleteName}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
      {scheduleBtn && (
        <AddTeacherSchedulePopUp
          term={term}
          year={year}
          teacherId={Number(teacherID)}
          teacherName={`${teacherData?.thaiName} ${teacherData?.thaiLastName}`}
          onClosePopUp={setschduleBtn}
        />
      )}
    </div>
  );
}
