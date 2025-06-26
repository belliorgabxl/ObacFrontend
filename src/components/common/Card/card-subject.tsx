"use client";
import { TeacherEnrollment } from "@/dto/teacherDto";
// import Link from "next/link";
import React from "react";

interface CardSubjectProps {
  cardSubjectData: TeacherEnrollment;
  term: string;
  year: number;
}

export default function CardSubject({
  cardSubjectData,
  year,
  term,
}: CardSubjectProps) {
  return (
    <div className=" border-[1px] hover:border-black border-gray-200 rounded-md my-3 bg-card text-card-foreground w-full hover:scale-[102%] duration-500 hover:bg-gray-50 shadow-md shadow-gray-200 bg-white grid grid-cols-[40%_21%_3%_36%]">
      <div className="ml-5 py-4 ">
        <div className="flex ">
          <div className="text-gray-600">
            วิชา: &nbsp;
            <span className="font-semibold text-blue-600">
              {cardSubjectData.subjectName}
            </span>{" "}
          </div>
        </div>
        <div className="text-gray-600">
          รหัสวิชา :&nbsp;
          <span className="font-semibold text-gray-800">
            {cardSubjectData.subjectCode}
          </span>
        </div>

        <div className="text-gray-600">
          จำนวนนักเรียน :&nbsp;
          <span className="font-semibold text-gray-800">
            {cardSubjectData.totalStudent}
          </span>
          &nbsp; คน
        </div>
      </div>

      <div className="py-3 w-11/12">
        <p className="text-center text-gray-600 font-semibold shadow-sm shadow-gray-400 py-1 px-2 bg-[#e4f1f8] rounded-md">
          {cardSubjectData.studentClass}.{cardSubjectData.groupName}
        </p>
        <div
          className={`${
            cardSubjectData.day == "วันจันทร์"
              ? " bg-gradient-to-tr from-yellow-300 via-yellow-200 to-red-200"
              : cardSubjectData.day == "วันอังคาร"
              ? "bg-gradient-to-tr from-red-300 via-pink-300  to-purple-200"
              : cardSubjectData.day == "วันพุธ"
              ? "bg-gradient-to-tr from-teal-300  to-green-200"
              : cardSubjectData.day == "วันพฤหัสบดี"
              ? "bg-gradient-to-tr from-red-400 via-orange-300 to-yellow-200"
              : cardSubjectData.day == "วันศุกร์"
              ? "bg-gradient-to-tr from-teal-300 via-sky-300  to-blue-200"
              : cardSubjectData.day == "วันเสาร์"
              ? "bg-gradient-to-tr from-purple-400 via-purple-300  to-teal-200"
              : cardSubjectData.day == "วันอาทิตย์"
              ? "bg-gradient-to-tr from-red-500 via-red-400  to-purple-200"
              : ""
          } text-center font-semibold mt-4 shadow-sm shadow-gray-400  py-1 rounded-sm `}
        >
          {cardSubjectData.day}
        </div>
      </div>
      <div
        className={`${
          cardSubjectData.isComplete
            ? "bg-[#D2F9E0]"
            : "bg-[#DBEFFA] h-full w-full"
        }`}
      ></div>
      <div
        className={`${
          cardSubjectData.isComplete
            ? "bg-[#9AFFBF]"
            : "bg-[#A0DDFD] h-full w-full"
        } rounded-r-md`}
      >
        <div className="text-center pt-1 text-lg text-white font-semibold">
          สถานะคะแนน
        </div>
        <div className=" text-center text-gray-700 text-xl font-semibold py-3">
          {!cardSubjectData.isComplete ? (
            <p>ยังไม่ตรวจสอบ</p>
          ) : (
            <p>ตรวจสอบเสร็จสิ้น</p>
          )}
        </div>
        <div className="text-center text-black font-semibold">
          ปีการศึกษา {term}/{year}
        </div>
      </div>
    </div>
  );
}
