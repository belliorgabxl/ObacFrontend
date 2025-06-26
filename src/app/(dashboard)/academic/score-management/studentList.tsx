"use client";
import { DataTable } from "@/components/common/MainTable/table_style_1";
import { Combobox } from "@/components/common/Combobox/combobox";
import { Input } from "@/components/ui/input";
import { GetAllStudentTableDto } from "@/dto/studentDto";
import { getAllStudentViewData } from "@/resource/academics/grading/viewData/individualGradeViewData";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function StudentListPage() {
  const [individualStudentData, setIndividualStudentData] = useState<
    GetAllStudentTableDto[]
  >([]);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  // Class levels from API
  const classLevels = Array.from(
    new Set(individualStudentData.map((student) => student.class))
  );
  // Faculty data from API
  const uniqueFaculties = Array.from(
    new Set(individualStudentData.map((student) => student.facultyName))
  );

  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllStudentViewData();
      setIndividualStudentData(data);
      setIsLoadingPage(true);
    };

    fetchData();
  }, []);

  const columns = [
    { label: "ลำดับ", key: "index", className: "w-2/16" },
    { label: "รหัสนักเรียน", key: "studentCode", className: "w-2/16" },
    { label: "ชื่อ - นามสกุล", key: "thaiName", className: "w-6/16" },
    { label: "ระดับชั้น", key: "class", className: "w-2/16" },
    {
      label: "หลักสูตรการศึกษา",
      key: "facultyName",
      className: "w-4/16 text-start line-clamp-1",
    },
  ];

  const filteredData = useMemo(() => {
    return individualStudentData.filter((student) => {
      const matchClassLevel = selectedClassLevel
        ? student.class === selectedClassLevel
        : true;
      const matchFaculty = selectedFaculty
        ? student.facultyName === selectedFaculty
        : true;
      const matchSearch = searchInput.toLocaleLowerCase()
        ? student.studentCode.toLocaleLowerCase().includes(searchInput) ||
          student.thaiName.toLocaleLowerCase().includes(searchInput)
        : true;

      return matchClassLevel && matchFaculty && matchSearch;
    });
  }, [individualStudentData, selectedClassLevel, selectedFaculty, searchInput]);

  return (
    <>
      {isLoadingPage ? (
        <header className="flex flex-col px-4 py-2 border-2 mt-4 rounded-lg w-full">
          <div className="flex gap-12">
            <div className="flex mx-auto gap-6 w-full px-2 pt-2 rounded-lg">
              <div className="w-1/6">
                <Combobox
                  options={classLevels.map((classData) => ({
                    value: classData,
                    label: classData,
                  }))}
                  buttonLabel="ระดับการศึกษา"
                  onSelect={setSelectedClassLevel}
                />
              </div>
              <div className="w-1/3">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pr-10"
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData.map((item, index) => ({
              ...item,
              index: index + 1,
            }))}
            getRowLink={(item) => {
              //find a student by studentCode
              const student = individualStudentData.find(
                (student) => student.studentCode === item.studentCode
              );

              return `/academic/score-management/individual/${student?.studentId}`;
            }}
            pagination={10}
          />
        </header>
      ) : (
        <div className="mt-2 h-screen border-2 border-dashed rounded-md w-full border-gray-400 grid place-items-center py-20 text-3xl text-blue-400 font-semibold items-center">
          <p className="flex gap-2">
            <Loader2 className="h-10 w-10 animate-spin" />
            Loading...
          </p>
        </div>
      )}
    </>
  );
}
