"use client";
import { DataTable } from "@/components/common/MainTable/table_style_1";
import { Combobox } from "@/components/common/Combobox/combobox";
import { Input } from "@/components/ui/input";
import { GetAllStudentTableDto } from "@/dto/studentDto";
import { getAllStudentViewData } from "@/resource/academics/grading/viewData/individualGradeViewData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function StudentListPage(props: {
  handleTab: (tab: string) => void;
  handleData: (data: { studentId: number; studentName: string }) => void;
}) {
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
      setIsLoadingPage(true)
    };

    fetchData();
  }, []);

  const router = useRouter();
  const handleRowClick = (item: GetAllStudentTableDto) => {
    router.push(`/academic/student-details/${item.studentId}`);
  };

  const columns = [
    { label: "ลำดับ", key: "index", className: "w-2/16 justify-center" },
    { label: "รหัสนักเรียน", key: "studentCode", className: "w-2/16" },
    { label: "ชื่อ - นามสกุล", key: "thaiName", className: "w-5/16" },
    { label: "ระดับชั้น", key: "class", className: "w-2/16" },
    {
      label: "หลักสูตรการศึกษา",
      key: "facultyName",
      className: "w-5/16 text-start line-clamp-1",
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
        <header className="flex flex-col p-4 border-2 mt-4 rounded-lg">
        <div className="flex gap-12 mt-4">
          <div className="flex mx-auto gap-6 w-full p-2 rounded-lg">
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
            <div className="w-1/6 ">
              <Combobox
                options={uniqueFaculties.map((faculty) => ({
                  value: faculty,
                  label: faculty,
                }))}
                buttonLabel="หลักสูตรการศึกษา"
                onSelect={setSelectedFaculty}
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
          onRowClick={handleRowClick}
          pagination={10}
        />
      </header>
    ):(
      <div className="mt-2 border-2 border-dashed rounded-md border-gray-400 grid place-items-center py-20 text-3xl text-blue-400 font-semibold items-center">
      <p className="flex gap-2">
        <Loader2 className="h-10 w-10 animate-spin" />
        Loading...
      </p>
    </div>
    )}
    
    </>
  );
}
