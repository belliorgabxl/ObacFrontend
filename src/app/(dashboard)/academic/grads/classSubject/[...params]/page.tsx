"use client";

import { Combobox } from "@/components/common/Combobox/combobox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClassSubjectColumn, ClassSubjectData } from "@/dto/gradingDto";
import { getSubjectClassViewData } from "@/resource/academics/grading/viewData/subjectClassViewData";
import { useEffect, useState } from "react";
import {
  getClassSubjectData,
  putPublishGrade,
} from "@/resource/academics/grading/api/subjectClassData";
import { DataTable } from "@/components/common/MainTable/table_style_1";
import Swal from "sweetalert2";
import { ScrollText } from "lucide-react";
import { GradingModeComponent } from "../../components/GradingModeComponent";

const ClassSubjectPage = ({ params }: { params: { params: string[] } }) => {
  const [rawClassSubjectData, setRawClassSubjectData] = useState<
    ClassSubjectData[]
  >([]);
  console.log(params);
  const subjectId = params.params[0];
  const term = params.params[1];

  console.log("subjectId:", subjectId);
  console.log("term:", term);

  const [subjectName, setSubjectName] = useState<string>("");
  const [yearName, setYearName] = useState<Number>(0);

  // search
  const [searchClassSubject, setSearchClassSubject] = useState<string>("");
  const [classSubjectData, setClassSubjectData] = useState<
    ClassSubjectColumn[]
  >([]);

  const [classSubjectDataFiltered, setClassSubjectDataFiltered] = useState<
    ClassSubjectColumn[]
  >([]);
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [periodNumbers, setPeriodNumbers] = useState<string[]>([]);
  const [teacherNames, setTeacherNames] = useState<string[]>([]);

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const handleSelectedInfoClassData = (id: number) => {
    // props.handleTab("infoClass");
    // const item = rawClassSubjectData.find(
    //   (item) => item.scheduleSubjectId === id
    // );
    // if (item) {
    //   props.handleSelectedData({
    //     subjectId: item.subjectId,
    //     scheduleSubjectId: item.scheduleSubjectId,
    //     room: `${item.class}.${item.studentGroupName}`,
    //     term: item.term,
    //     groupId: item.studentGroupId,
    //   });
    // } else {
    //   alert("ไม่พบข้อมูล");
    // }
  };
  // const subjectId = params.classSubject?.[0] ?? "";
  // const term = params.classSubject?.[1] ?? "";
  console.log("rawClassSubjectData", rawClassSubjectData);
  console.log("classSubjectData", subjectId);
  console.log("classSubjectData", term);

  const handlePusblishGrade = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใช้ไหมที่จะยืนยันการตัดคะแนน?",
      text: "เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้ กรุณาทบทวนข้อมูอีกครั้งก่อนตกลง",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    });

    if (result.isConfirmed) {
      const list_of_schudule_subject_id = classSubjectDataFiltered.map(
        (item) => item.id
      );

      try {
        for (const item of list_of_schudule_subject_id) {
          await putPublishGrade(item);
        }
        if (!params) return;

        // const subjectId = params.classSubject?.[0] ?? "";
        // const term = params.classSubject?.[1] ?? "";
        // props.handleTab("class");
        const rawData = await getClassSubjectData(
          Number(subjectId),
          Number(term)
        );
        setRawClassSubjectData(rawData);

        setSubjectName(rawData[0].subjectName);
        setYearName(rawData[0].year);

        const data = await getSubjectClassViewData(
          Number(subjectId),
          Number(term)
        );
        setClassSubjectData(data);

        const roomNumbers = Array.from(
          new Set(data.map((item) => item.room).filter((room) => room))
        );
        const periodNumbers = Array.from(
          new Set(data.map((item) => item.period).filter((period) => period))
        );
        const teacherNames = Array.from(
          new Set(
            data
              .map((item) => item.teacherName)
              .filter((teacherName) => teacherName)
          )
        );

        setRoomNumbers(roomNumbers);
        setPeriodNumbers(periodNumbers);
        setTeacherNames(teacherNames);

        setSelectedRoom(null);
        setSelectedPeriod(null);
        setSelectedTeacher(null);
      } catch (error) {
        console.error("Error publishing grade or reloading data:", error);
      }
    } else {
      console.log("Publishing grade canceled.");
    }
  };
  const columns = [
    { label: "คาบ", key: "period", className: "w-2/12 justify-center" },
    { label: "วัน", key: "day", className: "w-2/12" },
    { label: "ห้อง", key: "room", className: "w-2/12" },
    { label: "ชื่อครู", key: "teacherName", className: "w-4/12" },
    {
      label: "สถานะเกรด",
      key: "isPublish",
      className: "w-2/12",
      render: (row: { isPublish: boolean }) => (
        <div className={`flex items-center w-full justify-center`}>
          {row.isPublish ? (
            <div className="text-green-500">✅ ตัดเกรดแล้ว</div>
          ) : (
            <div className="text-red-500">❌ ยังไม่ตัดเกรด</div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params) return;
        // const subjectId = params.classSubject?.[0] ?? "";
        // const term = params.classSubject?.[1] ?? "";
        console.log("id ", subjectId);
        console.log("term ", term);
        const rawData = await getClassSubjectData(
          Number(subjectId),
          Number(term)
        );
        setRawClassSubjectData(rawData);
        setSubjectName(rawData[0].subjectName);
        setYearName(rawData[0].year);

        const data = await getSubjectClassViewData(
          Number(subjectId),
          Number(term)
        );
        setClassSubjectData(data);

        // filter data to dropdown
        const roomNumbers = Array.from(
          new Set(data.map((item) => item.room).filter((room) => room))
        );
        const periodNumbers = Array.from(
          new Set(data.map((item) => item.period).filter((period) => period))
        );
        const teacherNames = Array.from(
          new Set(
            data
              .map((item) => item.teacherName)
              .filter((teacherName) => teacherName)
          )
        );

        setRoomNumbers(roomNumbers);
        setPeriodNumbers(periodNumbers);
        setTeacherNames(teacherNames);
      } catch (error) {
        console.error("Error fetching grading data:", error);
      }
    };
    fetchData();
  }, []);

  // use for search
  useEffect(() => {
    const normalizedSearch = searchClassSubject.toLowerCase();
    const filterData = classSubjectData.filter((item) => {
      const matchSearch =
        item.id.toString().includes(normalizedSearch) ||
        item.day?.toLowerCase().includes(normalizedSearch) ||
        item.period?.toLowerCase().includes(normalizedSearch) ||
        item.room?.toLowerCase().includes(normalizedSearch) ||
        item.teacherName?.toLowerCase().includes(normalizedSearch);

      const matchesRoom = selectedRoom ? item.room === selectedRoom : true;

      const matchesPeriod = selectedPeriod
        ? item.period === selectedPeriod
        : true;

      const matchesTeacher = selectedTeacher
        ? item.teacherName === selectedTeacher
        : true;

      return matchSearch && matchesRoom && matchesPeriod && matchesTeacher;
    });
    setClassSubjectDataFiltered(filterData);
  }, [
    searchClassSubject,
    classSubjectData,
    selectedRoom,
    selectedPeriod,
    selectedTeacher,
  ]);

  return (
    <>
      <div>
        <div className="sm:px-5 lg:px-10 p-4">
          <div>
            <div className="w-full justify-start  flex">
              <div
                className="w-fit px-10 text-xl flex gap-2 items-center border border-gray-100 shadow-md  py-2 text-blue-700  rounded-3xl "
                style={{ userSelect: "none" }}
              >
                <ScrollText className="w-8 h-8" />
                ออกเกรดรายวิชา
              </div>
            </div>
            <div className="flex justify-end items-end mt-2">
              <GradingModeComponent />
            </div>
          </div>
        </div>

        <header className="flex flex-col mx-10 sm:px-5 lg:px-10 p-4 border-2 mt-4 rounded-lg ">
          {/* detail table */}
          <div className=" flex mb-4 justify-between">
            <div className="flex w-fit">
              <Badge variant={"outline"}>
                <h1 className="text-base">รายวิชา : {subjectName}</h1>
              </Badge>
            </div>
            <div className="flex w-fit gap-6 text-base">
              <div>
                <Badge variant={"outline"}>
                  <h1 className="text-base">
                    ชั้นปีการศึกษา : {yearName.toString()}
                  </h1>
                </Badge>
              </div>
            </div>
          </div>
          {/* filter Data */}
          <div className="flex gap-12 px-4 py-2 bg-slate-50 rounded-lg">
            {/* filter */}
            <div className="w-1/4 flex flex-col gap-1">
              <h1>รายชื่ออาจารย์</h1>
              <Combobox
                options={teacherNames.map((item) => ({
                  value: item,
                  label: item,
                }))}
                buttonLabel="เลือกอาจารย์ผู้สอน"
                onSelect={(selected) => setSelectedTeacher(selected)}
              />
            </div>

            <div className="w-1/4 flex flex-col gap-1">
              <h1>ห้องเรียน</h1>
              <Combobox
                options={roomNumbers.map((item) => ({
                  value: item,
                  label: item,
                }))}
                buttonLabel="เลือกห้องเรียน"
                onSelect={(selected) => setSelectedRoom(selected)}
              />
            </div>

            <div className="w-1/4 flex flex-col gap-1">
              <h1>คาบเรียน</h1>
              <Combobox
                options={periodNumbers.map((item) => ({
                  value: item,
                  label: item,
                }))}
                buttonLabel="เลือกคาบเรียน"
                onSelect={(selected) => setSelectedPeriod(selected)}
              />
            </div>

            <div className="relative w-1/3 flex items-end">
              <div className="bg-white w-full">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pr-10"
                  onChange={(event) =>
                    setSearchClassSubject(event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          {/* data zone */}
          <div className="w-full px-4 py-2">
            <DataTable
              columns={columns}
              data={classSubjectDataFiltered.map((item, index) => ({
                id: item.id,
                day: item.day,
                period: item.period,
                room: item.room,
                teacherName: item.teacherName,
                isPublish: item.isPublish,
              }))}
              pagination={classSubjectDataFiltered.length}
              // onRowClick={(item) => handleSelectedInfoClassData(item.id)}
              getRowLink={(item) => {
                const data = rawClassSubjectData.find(
                  (chk) => chk.scheduleSubjectId === item.id
                );

                return `/academic/grads/student-info/${subjectId}/${data?.scheduleSubjectId}/${term}/${data?.studentGroupId}/${data?.year}`;
              }}
            />
            <div className="flex justify-end px-10">
              <button
                onClick={handlePusblishGrade}
                className="px-10 py-1 rounded-md text-white bg-gradient-to-tr from-teal-400 to-blue-800 hover:bg-blue-600 hover:scale-[102%] duration-300"
              >
                ตัดเกรด
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};
export default ClassSubjectPage;
