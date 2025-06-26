"use client";

import React from "react";
import { useState, useEffect } from "react";
import { fetchTeacherUser } from "@/api/oldApi/teacher/teacherAPI";
import { GetTeacherByTeacherId } from "@/dto/teacherDto";

const getTeachData = async () => {
  try {
    const teacher = await fetchTeacherUser();
    return teacher;
  } catch (err) {
    console.error("Failed to fetch teacher by ID:", err);
  }
};

export default function ProfileForm() {
  const [teachers, setTeacher] = useState<GetTeacherByTeacherId>();
  useEffect(() => {
    getTeachData().then((items) => {
      setTeacher(items);
    });
  }, []);
  return (
    <div className="text-xl py-10 w-full font-sans">
      <div className="w-full mt-10 grid place-items-center">
        <div className="relative w-full max-w-3xl flex justify-center items-center">
          <div className="  absolute mix-blend-multiply filter blur-xl top-0 left-10 w-72 h-72  bg-sky-300 opacity-90 rounded-full animate-blob"></div>
          <div className="  absolute mix-blend-multiply filter blur-xl top-0 right-10 w-72 h-72  bg-yellow-300 opacity-90 rounded-full  animate-blob animation-delay-2000"></div>
          <div className=" absolute mix-blend-multiply filter blur-xl bottom-0 left-30 w-72 h-72 bg-pink-300 opacity-90 rounded-full  animate-blob animation-delay-4000"></div>
          {/* 
          <div className=" absolute mix-blend-multiply filter blur-lg bottom-10 left-24 w-36 h-36 bg-teal-300 opacity-90 rounded-full  animate-blob animation-delay-2000"></div>

          <div className=" absolute mix-blend-multiply filter blur-lg -bottom-32  w-36 h-36 bg-blue-400 opacity-90 rounded-full  animate-blob2 "></div> */}

          <div className="grid place-items-center gap-8">
            <div className="px-10 py-3 rounded-full h-fit w-fit text-3x bg-white/50 text-gray-700 backdrop-blur-sm">
              ข้อมูลอาจารย์
            </div>
            <div className="rounded-lg px-10 grid gap-4 py-4  bg-white z-10">
              <div className="w-full text-center flex gap-4 items-center ">
                ชื่อ{" "}
                <p className="text-gray-600">
                  {teachers?.thaiName} {teachers?.thaiLastName}
                </p>
              </div>
              <div className="w-full flex gap-4 items-center ">
                <div className="flex gap-4 items-center">
                  อีเมลล์{" "}
                  <p className="text-gray-600">
                    {teachers?.teacherEmail || "-"}
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  เบอร์ติดต่อ{" "}
                  <p className="text-gray-600">
                    {teachers?.teacherPhone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
