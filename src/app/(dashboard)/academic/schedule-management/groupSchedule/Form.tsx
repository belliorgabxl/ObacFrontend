"use client";
import {
  fetchDeleteScheduleSubject,
  fetchGetScheduleOfStudentGroupByGroupID,
} from "@/api/oldApi/schedule/scheduleAPI";
import { ScheduleSubject, StudentGroupScheduleSubject } from "@/dto/schedule";
import { Boxes, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddGroupSchedulePopUp from "./AddGroupSchedulePopUp";
import { toast } from "react-toastify";

type Props = {
  term: string;
  year: string;
  groupId: number;
};

const getSchedule = async (term: string, year: string, groupId: number) => {
  try {
    const response = await fetchGetScheduleOfStudentGroupByGroupID(
      groupId,
      term,
      Number(year)
    );
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default function Form({ term, year, groupId }: Props) {
  const [schedules, setSchedules] =
    useState<StudentGroupScheduleSubject | null>(null);
  const [scheduleBtn, setScheduleBtn] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const [deleteTrigger, setDeleteTrigger] = useState<boolean>(false);
  const [deleteID, setDeleteID] = useState<number>(0);
  const [deleteName, setDeleteName] = useState<string>("");

  useEffect(() => {
    getSchedule(term, year, groupId).then((item: any) => {
      if (item) {
        setSchedules(item);
        setGroupName(`${item.class}.${item.groupName}`);
      }
    });
  }, []);
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
  const thaiDaysOrder = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์"
  ];
  const sortedScheduleSubjects = schedules?.scheduleSubjects
  ? [...schedules.scheduleSubjects].sort((a, b) => {
      return thaiDaysOrder.indexOf(a.day) - thaiDaysOrder.indexOf(b.day);
    })
  : [];
  return (
    <div className="w-full px-10">
      <div className="py-5 flex justify-center">
        <h1 className="px-10 text-xl py-2 bg-pink-500 text-white flex gap-2 items-center rounded-3xl">
          <Boxes className="h-8 w-8" />
          ตารางเรียนของห้องเรียน
        </h1>
      </div>
      <div className="w-full py-2 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="flex gap-4 items-center">
            <p className="py-1 px-2 rounded-md border border-gray-400 text-gray-950">
              {schedules?.class}.{schedules?.groupName}
            </p>
            <p className="py-1 px-2 rounded-md border border-gray-400">
              ภาคเรียนที่ {schedules?.term} ปีการศึกษา {schedules?.year}
            </p>
            <p className="py-1 px-2 rounded-md border border-gray-400">
              จำนวนวิชาเรียน {schedules?.totalSubject} วิชา
            </p>
            <p className="py-1 px-2 rounded-md border border-gray-400">
              {schedules?.totalCredit} หน่วยกิต
            </p>
          </div>
        </div>

        <button
          className="px-10 py-1.5 flex gap-2 h-fit items-center bg-blue-500 hover:bg-blue-600 text-white rounded-3xl"
          onClick={() => setScheduleBtn(true)}
        >
          <PlusCircle className="w-5 h-5 text-white" />
          เพิ่มตารางเรียน
        </button>
      </div>

      <div className="w-full">
        <div className="w-full grid grid-cols-[10%_27%_20%_8%_10%_10%_10%_5%] bg-white border-t-2 border-b-2 shadow-lg text-lg border-gray-400">
          <div className="text-center py-2 ">
            รหัสวิชา
          </div>
          <div className="text-center py-2 ">
            ชื่อวิชา
          </div>
          <div className="text-center py-2 ">
            อาจารย์ผู้สอน
          </div>
          <div className="text-center py-2 ">
            ห้องเรียน
          </div>
          <div className="text-center py-2 ">
            หน่วยกิต
          </div>
          <div className="text-center py-2 ">
            คาบเรียน
          </div>
          <div className="text-center py-2 ">
            วันสอน
          </div>
          <div className="text-center py-2 "></div>
        </div>
        <div className="shadow-md">
        {sortedScheduleSubjects?.length > 0 ? (
           sortedScheduleSubjects.map((item: ScheduleSubject, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : ""
              } grid grid-cols-[10%_27%_20%_8%_10%_10%_10%_5%] border text-[16px] border-gray-300 text-gray-700 border-t-0`}
            >
              <p className="text-start flex items-center px-4 border-r border-gray-300 py-1 line-clamp-1">
                {item.subjectCode}
              </p>
              <p className="text-start flex items-center  px-4 border-r border-gray-300 py-1 line-clamp-1">
                {item.subjectName}
              </p>
              <p className="text-center flex items-center justify-center border-r border-gray-300">
                {item.teacherName}&nbsp;&nbsp;&nbsp;&nbsp;{item.teacherLastName}
              </p>
              <p className="text-center flex items-center justify-center border-r border-gray-300">
                {item.room}
              </p>
              <p className="text-center flex items-center justify-center border-r border-gray-300">
                {item.credit}
              </p>
              <p className="text-center flex items-center justify-center border-r border-gray-300">
                {item.period}
              </p>
              <p className="text-center py-1 flex items-center justify-center border-r border-gray-300">
                {item.day}
              </p>
              <div className="text-center flex items-center w-full justify-center text-gray-700  py-1 ">
                <p
                  className="px-4 py-1 bg-red-400 hover:bg-red-700 text-white rounded-sm"
                  onClick={() => {
                    setDeleteTrigger(true);
                    setDeleteID(item.id);
                    setDeleteName(item.subjectName);
                  }}
                >
                  ลบ
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="grid place-items-center border-2 border-dashed border-t-0 text-[24px] border-gray-400 text-gray-700 py-10 text-center">
            ไม่มีตารางเรียน
          </div>
        )}</div>
      </div>
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
      {scheduleBtn && groupName && (
        <AddGroupSchedulePopUp
          term={term}
          year={year}
          groupId={groupId}
          groupName={groupName}
          onClosePopUp={setScheduleBtn}
        />
      )}
    </div>
  );
}
