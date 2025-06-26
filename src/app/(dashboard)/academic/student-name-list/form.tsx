"use client";
import React, { useEffect, useState } from "react";
import { ClassroomGrading } from "./classroomGrading";
import { fetchGetAllStudent } from "@/api/oldApi/student/studentApi";
import { GetAllStudent } from "@/dto/studentDto";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { BookUser, Loader2, Search } from "lucide-react";
export interface ClassroomByGroupIdProps {
  groupId: number;
  term: string;
  year: string;
  classroom: string;
}

const getStudentList = async () => {
  try {
    const response = await fetchGetAllStudent();
    return response;
  } catch (err) {}
};

export default function Form() {
  const [studentListName, setStudentListName] = useState<GetAllStudent[]>([]);
  const [activeTab, setActiveTab] = useState<string>("classroom");
  const [selectedClassroomData, setSelectedClassroomData] =
    useState<ClassroomByGroupIdProps>();
  const router = useRouter();
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  useEffect(() => {
    getStudentList().then((item: any) => {
      setStudentListName(item);
    });
  }, []);

  const [selectedStudent, setSelectedStudent] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const handleTab = (tab: string) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    if (activeTab === "classroomByGroupId") {
      setSelectedClassroomData(undefined);
    }
  };

  const handleSelectedClassRoomDataByGroupId = (
    data: ClassroomByGroupIdProps
  ) => {
    setSelectedClassroomData(data);
    setActiveTab("classroomByGroupId");
  };
  const handleSubjectChange = (
    option: { value: number; label: string } | null
  ) => {
    setSelectedStudent(option);
  };

  const onSearch = () => {
    setSearchTrigger(true);
    router.push(`/academic/student-details/${selectedStudent?.value}`);
  };

  const studentNameOptions = studentListName.map((item) => ({
    value: item.studentId,
    label: `${item.studentCode} ${item.thaiName} ${item.thaiLastName}`,
  }));

  return (
    <div className="py-5 w-full">
      <div className="flex justify-start py-2 items-center">
        <div className="px-10 py-2 rounded-3xl  text-xl w-fit border border-gray-100 shadow-md   text-blue-700 flex gap-2 items-center">
          <BookUser className="w-8 h-8"/>
          รายชื่อและข้อมูลนักเรียน
        </div>
      </div>
      <div className="pt-2 grid place-items-start">
        <div className=" flex justify-between w-full items-center gap-4 ">
          <div className="flex w-[400px] gap-1 items-center px-5">
            {searchTrigger ? (
              <button className=" py-1.5 bg-blue-400 flex gap-2  items-center text-white rounded-md px-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                ค้นหา
              </button>
            ) : (
              <button
                className="bg-blue-300  py-1.5 enabled:bg-blue-500 enabled:hover:bg-blue-600 flex gap-2 items-center text-white rounded-md px-4"
                onClick={() => {
                  onSearch();
                }}
                disabled={!selectedStudent}
              >
                <Search className="w-5 h-5" />
                ค้นหา
              </button>
            )}

            <Select
              options={studentNameOptions}
              value={selectedStudent}
              onChange={handleSubjectChange}
              isSearchable
              placeholder="   -- รหัสนักเรียน --"
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
              }}
            />
          </div>
          <div className="px-5">
            <button
              className="text-sm px-10 py-2 bg-blue-500 rounded-sm text-white hover:bg-blue-600"
              onClick={() => {
                router.push("/academic/student-info-list/studentList");
              }}
            >
              รายชื่อนักเรียนทั้งหมด
            </button>
          </div>
        </div>
      </div>
      <div>
        {activeTab === "classroom" && (
          <ClassroomGrading
            handleTab={handleTab}
            handleSelectedData={handleSelectedClassRoomDataByGroupId}
          />
        )}
      </div>
    </div>
  );
}
