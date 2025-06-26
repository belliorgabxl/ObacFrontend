"use client";
import React, { useEffect, useState} from "react";
import { BookText, PlusCircle } from "lucide-react";
import { GetStudentGroupsByTermYearDto } from "@/dto/studentDto";
import { fetchGetStudentGroupsByTermYear } from "@/api/oldApi/student/studentApi";
import { GetAllTeacher } from "@/dto/teacherDto";
import { fetchGetAllTeacherAsync } from "@/api/oldApi/teacher/teacherAPI";
import Link from "next/link";
import AddSchedulePopUp from "./AddSchedulePopUp";

const getStudentGroup = async (term: string, year: number) => {
  try {
    const response = await fetchGetStudentGroupsByTermYear(term, year);
    return response;
  } catch (err) {
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

export default function Form() {
  const dateTime = new Date();
  const currentMonth = dateTime.getMonth(); 
  const currentYear = currentMonth > 5
  ? dateTime.getFullYear() + 543 
  : dateTime.getFullYear() + 543 - 1;
  const defaultTerm  =  currentMonth > 5 ? "1" : "2"
  const [toggleMode, setToggleMode] = useState<boolean>(false);
  const [popUpAddSubject, setpopUpAddSubject] = useState<boolean>(false);
  const [term, setTerm] = useState<string>(defaultTerm);
  const [year, setYear] = useState<number>(currentYear);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [studentGroup, setStudentGroup] = useState<
    GetStudentGroupsByTermYearDto[]
  >([]);
  const [teachers, setTeacher] = useState<GetAllTeacher[]>();
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");

  const filteredTeachers = teachers?.filter(
    (item) =>
      (item.teacherCode?.toLowerCase() || "").includes(
        searchTeacher.toLowerCase()
      ) ||
      (item.thaiName?.toLowerCase() || "").includes(
        searchTeacher.toLowerCase()
      ) ||
      (item.thaiLastName?.toLowerCase() || "").includes(
        searchTeacher.toLowerCase()
      ) ||
      (item.facultyName?.toLowerCase() || "").includes(
        searchTeacher.toLowerCase()
      )
  );
  const filteredStudent = studentGroup?.filter(
    (item) =>
      `${item.class}.${item.groupName}`
        .toLowerCase()
        .includes(searchStudent.toLowerCase()) ||
      (item.facultyName?.toLowerCase() || "").includes(
        searchStudent.toLowerCase()
      )
  );

  useEffect(() => {
    getStudentGroup(term, Number(year)).then(
      (d: GetStudentGroupsByTermYearDto[]) => {
        setStudentGroup(d);
      }
    );
    getAllTeacher().then((d) => {
      setTeacher(d);
    });
    setLoading(true);
  }, []);

  useEffect(() => {
    getStudentGroup(term, Number(year)).then(
      (d: GetStudentGroupsByTermYearDto[]) => {
        setStudentGroup(d);
      }
    );
  }, [term, year]);

  return (
    <div className="w-full">
      <div className="flex items-center py-5 justify-start px-10">
        <div></div>
        <h1 className="px-10 py-2 rounded-3xl  text-xl w-fit border border-gray-100 shadow-md   text-blue-700 flex gap-2 items-center">
          <BookText className="w-8 h-8" />
          ระบบจัดการตารางเรียน - ตารางสอน
        </h1>
      </div>
      <div className="w-full items-center justify-between px-10 flex gap-2">
        <div className="flex gap-2 items-center">
          <button
            className={`px-10 py-1 ${
              !toggleMode
                ? "bg-blue-500  text-white"
                : "bg-white border-blue-500  border  text-blue-800 hover:bg-gray-200"
            } duration-300 flex items-center  rounded-md`}
            onClick={() => {
              setToggleMode(false);
            }}
          >
            นักเรียน
          </button>
          <button
            className={`px-10 py-1 duration-500 ${
              !toggleMode
                ? "bg-white border-blue-500  border   text-blue-800 hover:bg-gray-200"
                : "bg-blue-500  text-white"
            } duration-300 flex items-cente  rounded-md`}
            onClick={() => setToggleMode(true)}
          >
            อาจารย์
          </button>
          <div className="px-5 flex items-center">
            {toggleMode ? (
              <div>
                <input
                  type="text"
                  placeholder="ค้นหาอาจารย์..."
                  value={searchTeacher}
                  onChange={(e) => setSearchTeacher(e.target.value)}
                  className="border border-gray-300 px-4 py-1 rounded-md  w-full"
                />
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="ค้นหาห้องเรียน..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="border border-gray-300 px-4 py-1 rounded-md  w-full"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-5 justify-center">
             <div className="flex items-center gap-2">
            <label>ภาคเรียน</label>
            <select
              className="py-1 px-2 rounded-sm  border focus:outline-blue-400 focus:outline-1"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label>ปีการศึกษา</label>
            <select
              className="py-1 px-2 rounded-sm border focus:outline-blue-400 focus:outline-1"
              onChange={(e) => setYear(Number(e.target.value))}
              value={year}
            >
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
              <option value={currentYear - 3}>{currentYear - 3}</option>
              <option value={currentYear - 4}>{currentYear - 4}</option>
            </select>
          </div>
          </div>
         
        </div>
        <button
          className="px-10 py-1.5 flex gap-2 h-fit items-center bg-blue-500 hover:bg-blue-600 text-white rounded-3xl"
          onClick={() => setpopUpAddSubject(true)}
        >
          <PlusCircle className="w-5 h-5 text-white " />
          เพิ่มตารางเรียน
        </button>
      </div>
      {isLoading ? (
        <div>
          {toggleMode ? (
            <div className="w-full rounded-sm py-2 px-10">
              <div className="w-full shadow-lg grid grid-cols-[5%_20%_20%_20%_15%] bg-white border-t-2 border-b-2 border-gray-400  text-gray-800   text-lg">
                <div className="text-center py-1 ">No.</div>
                <div className="text-center py-1 ">ชื่อ</div>
                <div className="text-center py-1">นามสกุล</div>
                <div className="text-center py-1 ">หมวดวิชา</div>
                <div className="text-center py-1 ">เบอร์ติดต่อ</div>
              </div>
              {filteredTeachers && filteredTeachers?.length > 0 ? (
                <div className="shadow-md">
                  {" "}
                  {filteredTeachers?.map((item: GetAllTeacher, index) => (
                    <Link
                      href={`/academic/schedule-management/teacherSchedule?param1=${term}&param2=${year.toString()}&param3=${
                        item.teacherId
                      }`}
                      key={item.teacherId}
                      className={` ${
                        index % 2 == 0 ? "bg-white" : "bg-white"
                      } grid grid-cols-[5%_20%_20%_20%_20%_15%]  hover:bg-blue-50 border border-gray-300  border-t-0`}
                    >
                      <div className="text-center flex items-center w-full justify-center text-gray-700 border-r py-1   border-gray-300">
                        {index + 1}
                      </div>
                      <div className="text-center flex items-center text-gray-700 py-1 px-4 border-r border-gray-300 ">
                        <p className="line-clamp-1">{item.thaiName}</p>
                      </div>
                      <div className="text-center flex items-center w-full text-gray-700 justify-start px-4 py-1 border-r border-gray-300">
                        <p className="line-clamp-1">{item.thaiLastName}</p>
                      </div>
                      <div className=" flex items-center text-gray-700 justify-center gap-2 border-r py-1 border-gray-300">
                        <p className="line-clamp-1">{item.facultyName}</p>
                      </div>
                      <div className=" flex items-center text-gray-700 justify-center gap-2 py-1">
                        091-874-1224
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border-2 py-10 border-dashed grid place-items-center border-t-0  text-2xl text-gray-500 border-gray-400">
                  ไม่มีข้อมูลอาจารย์
                </div>
              )}
            </div>
          ) : (
            <div className="w-full rounded-sm py-2 px-10">
              <div className="w-full shadow-lg grid grid-cols-[5%_15%_30%_40%_10%] bg-white border-t-2 border-b-2 border-gray-400  text-gray-800   text-lg ">
                <div className="text-center  py-1.5">No.</div>
                <div className="text-center py-1.5 ">ระดับชั้น</div>
                <div className="text-center py-1.5 ">หลักสูตร</div>
                <div className="text-center py-1.5 ">รหัสห้อง</div>
                <div className="text-center py-1.5">จำนวนนักเรียน</div>
              </div>
              {filteredStudent && filteredStudent.length > 0 ? (
                <div className="shadow-md">
                  {filteredStudent?.map(
                    (item: GetStudentGroupsByTermYearDto, index) => (
                      <Link
                        href={`/academic/schedule-management/groupSchedule?param1=${term}&param2=${year}&param3=${item.groupId}`}
                        key={item.groupId}
                        className={` ${
                          index % 2 == 0 ? "bg-white" : "bg-white"
                        } grid grid-cols-[5%_15%_30%_40%_10%] text-gray-700 hover:bg-blue-100 border border-gray-300  border-t-0`}
                      >
                        <div className="text-center flex items-center w-full justify-center text-gray-700 border-r py-1  border-gray-300">
                          {index + 1}
                        </div>
                        <div className="text-center flex items-center text-gray-700 py-1 px-4 border-r border-gray-300">
                          <p className="line-clamp-1">
                            {item.class}.{item.groupName}
                          </p>
                        </div>
                        <div className="text-center flex items-center text-gray-700 py-1 px-4 border-r border-gray-300">
                          <p className="line-clamp-1">{item.facultyName}</p>
                        </div>
                        <div className="text-center flex items-center text-gray-700 py-1 px-4 border-r border-gray-300">
                          <p className="line-clamp-1">{item.groupCode}</p>
                        </div>
                        <div className=" flex items-center justify-center gap-2 py-1">
                          {/* {item.studentCount} */}-
                        </div>
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <div className="border-2 py-10 border-dashed grid place-items-center border-t-0  text-2xl text-gray-500 border-gray-400">
                  ไม่มีข้อมูลชั้นเรียน
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-5 px-5">
          <div className="border-2 rounded-md border-dashed border-gray-400 grid place-items-center py-10 ">
            <div className="text-4xl text-gray-500 font-semibold animate-pulse">
              Loading...
            </div>
          </div>
        </div>
      )}

      {popUpAddSubject == true && (
        <AddSchedulePopUp
          onClosePopUp={setpopUpAddSubject}
          year={year.toString()}
        />
      )}
    </div>
  );
}
