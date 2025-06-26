"use client";
import { DataTable } from "@/components/common/MainTable/table_style_1";
import { Combobox } from "@/components/common/Combobox/combobox";
// import { Input } from "@/components/ui/input";
// import { }
import {
  FacultyInfo,
  EducationData,
  filterProgramsParamsData,
} from "@/dto/studentDto";
import { getGroupSummaryGradeViewData } from "@/resource/academics/grading/viewData/classroomByGroupIdViewData";
import {
  filterProgramsViewData,
  getRawProgramViewData,
} from "@/resource/academics/studentInfoList/viewData/filterProgramsParamsViewData";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GroupSummaryGradeResponse } from "./classroom/[...params]/page";
import TotalScoreInGroup, {
  DataList,
} from "@/lib/PDF/TotalScoreInGroup";
import { toast } from "react-toastify";
import { GetStudentListByGroupID } from "@/api/oldApi/student/studentApi";
import { ConvertClassroomGradingToExcel, ConvertClassroomToExcel } from "@/lib/convertToExcel";
import { useRouter } from "next/navigation";

interface ClassroomTable {
  class: string;
  facultyName: string;
  programName: string;
  groupId: string;
  groupCode: string;
}

const getStudentDataList = async (groupId: number) => {
  try {
    const response = await GetStudentListByGroupID(groupId);
    return response;
  } catch (err) {
    return [];
  }
};

export function ClassroomGrading() {
  const router = useRouter();
  const classLevels = ["ปวช", "ปวส"];
  // const levelGrade: Record<string, string[]> = {
  //   ปวช: ["1", "2", "3"],
  //   ปวส: ["1", "2"],
  // };
  const term = ["1", "2"];
  const dateTime = new Date();
  const currentMonth = dateTime.getMonth();
  const currentYear =
    currentMonth > 5
      ? dateTime.getFullYear() + 543
      : dateTime.getFullYear() + 543 - 1;
  const defaultTerm = currentMonth > 5 ? "1" : "2";
  const yearsList = Array.from({ length: 3 }, (_, i) =>
    (currentYear - i).toString()
  );
  const [selectedTerm, setSelectedTerm] = useState<string>(defaultTerm);
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  // data in table
  const [dataTable, setDataTable] = useState<ClassroomTable[]>([]);

  // use for selected filter
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [vocationalFaculties, setVocationalFaculties] = useState<FacultyInfo[]>(
    []
  );
  const [diplomaFaculties, setDiplomaFaculties] = useState<FacultyInfo[]>([]);
  const [program, setProgram] = useState<string[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  // get faculties from selected course
  const getFaculties = (courseData: EducationData[]): FacultyInfo[] => {
    return courseData.flatMap((faculty) =>
      faculty.groupsCourse.map((group) => ({
        facultyName: group.facultyName,
        groupProgram: group.groupProgram,
      }))
    );
  };
  // get program from selected faculty
  const getPrograms = (selectedFaculty: string) => {
    const faculties = [...vocationalFaculties, ...diplomaFaculties].filter(
      (item) => item.facultyName === selectedFaculty
    );
    return faculties[0]?.groupProgram.map((item) => item.programName) || [];
  };

  //   console.log(studentColumnsData);
  // Function to handle selection change

  const handleClassLevelChange = (selected: string) => {
    setSelectedClassLevel(selected);
    setSelectedFaculty("");
    setSelectedProgram("");
    setSelectedGradeLevel("");
    setSelectedRoom("");
  };

  const handleFacultyChange = (selected: string) => {
    setSelectedFaculty(selected);
    setSelectedProgram("");
    setSelectedGradeLevel("");
    setSelectedRoom("");
    const getProgramsBySelected = getPrograms(selected);
    setProgram(getProgramsBySelected);
  };
  const handleProgramChange = (selected: string) => {
    setSelectedProgram(selected);
    setSelectedGradeLevel("");
    setSelectedRoom("");
  };

  const [summaryData, setSummaryData] =
    useState<GroupSummaryGradeResponse | null>(null);

  useEffect(() => {
    const fetchFilterData = async () => {
      const rawData = await getRawProgramViewData(selectedTerm, selectedYear);

      const formattedData: ClassroomTable[] = rawData.map(
        (item: filterProgramsParamsData) => ({
          class: `${item.class}. ${item.groupName}`,
          facultyName: item.facultyName,
          groupId: item.groupId,
          programName: item.programName,
          groupCode: item.groupCode,
        })
      );

      setDataTable(formattedData);

      // set for filter data
      const data = await filterProgramsViewData(selectedTerm, selectedYear);
      const vocational = data.filter(
        (item: EducationData) => item.classLevel === "ปวช"
      );
      const diploma = data.filter(
        (item: EducationData) => item.classLevel === "ปวส"
      );

      setVocationalFaculties(getFaculties(vocational));
      setDiplomaFaculties(getFaculties(diploma));
      setIsLoadingPage(true);
    };

    fetchFilterData();
  }, []);

  const [triggerDownLoadPDF, setTriggerDownLoadPDF] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    const filtered = dataTable.filter((item) => {
      const matchClassLevel = selectedClassLevel
        ? item.class.substring(0, 3) === selectedClassLevel
        : true;

      const matchFaculty = selectedFaculty
        ? item.facultyName === selectedFaculty
        : true;
      const matchProgram = selectedProgram
        ? item.programName === selectedProgram
        : true;
      const matchRoom = selectedRoom ? item.class === selectedClassLevel : true;

      // Extract year level from item.class (e.g., xxx. 1/x → yearLevel = 1)
      const yearLevel = parseInt(item.class.substring(5, 6), 10);

      const matchYearLevel = currentYear - Number(selectedYear);
      // console.log(currentYear, selectedYear, yearLevel, matchYearLevel);

      let isYearLevelValid = false;

      if (matchYearLevel === 0) {
        isYearLevelValid = true;
      } else if (matchYearLevel === 1) {
        isYearLevelValid = yearLevel > 1;
      } else if (matchYearLevel === 2) {
        isYearLevelValid = yearLevel === 3;
      }

      return (
        matchClassLevel &&
        matchFaculty &&
        matchProgram &&
        matchRoom &&
        isYearLevelValid
      );
    });

    const sortedData = filtered.sort((a, b) => +a.groupId - +b.groupId);
    return sortedData;
  }, [
    dataTable,
    selectedClassLevel,
    selectedFaculty,
    selectedProgram,
    selectedRoom,
    selectedYear,
    currentYear,
  ]);
  // console.log("filteredData", filteredData);

  // "facultyName": "บริหารธุรกิจ",
  //     "programName": "การเงินและบัญชี",
  //     "class": "ปวช",
  //     "groupId": 1,
  //     "groupName": "1/1",
  //     "groupCode": "AC-101"
  const handleDownloadPDF = async (
    groupId: number,
    findAClassLevel: string
  ) => {
    const result = await getGroupSummaryGradeViewData(
      groupId,
      selectedTerm,
      selectedYear
    );

    if (!result) {
      toast.error("ไม่พบข้อมูลสำหรับดาวน์โหลด PDF");
      return;
    }
    setSummaryData(result);

    const convertTOPDFData: DataList = {
      generalData: result.generalData
        ? {
            groupId: result.generalData.groupId,
            groupName: result.generalData.groupName,
            groupCode: result.generalData.groupCode,
            class: result.generalData.class,
            facultyName: result.generalData.facultyName,
            programName: result.generalData.programName,
            term: result.generalData.term,
            year: result.generalData.year,
          }
        : {
            groupId: 0,
            groupName: "",
            groupCode: "",
            class: "",
            facultyName: "",
            programName: "",
            term: "",
            year: 0,
          },
      studentList: result.students || [],
    };

    if (!convertTOPDFData.generalData.groupId) {
      toast.error("ข้อมูลไม่ครบถ้วน");
      return;
    }
    TotalScoreInGroup(convertTOPDFData);
  };

  const handleDownloadExcel = async (groupId: number) => {
    try {
      const summaryData = await getGroupSummaryGradeViewData(
        groupId,
        selectedTerm,
        selectedYear
      );
      if (summaryData) {
        ConvertClassroomGradingToExcel(
                summaryData.generalData,
                summaryData.students
              );
      } else {
        alert("No student data available for this group.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to fetch student data. Please try again.");
    }
  };

  const onRowClick = (item: ClassroomTable) => {
    router.push(
      `/academic/score-management/classroom/${item.groupId}/${selectedTerm}/${selectedYear}`
    );
  };

  const columns = [
    { label: "ลำดับ", key: "groupId", className: "w-1/12 justify-center" },
    { label: "ระดับชั้น", key: "class", className: "w-2/12" },
    { label: "รหัสห้อง", key: "groupCode", className: "w-2/12" },
    {
      label: "หลักสูตรการศึกษา",
      key: "facultyName",
      className: "w-4/12 xl:justify-start justify-center",
    },
    {
      label: "ใบออกเกรด",
      key: "action",
      className: "w-3/12 justify-center",
      render: (row: ClassroomTable) => (
        <div className="flex gap-1">
          <button
            className="px-3 bg-white border hover:bg-blue-600 rounded-full h-fit py-0.5 text-blue-400 hover:text-white flex text-sm justify-center items-center gap-2"
            onClick={(e) => {
              handleDownloadPDF(Number(row.groupId), row.class);
              e.stopPropagation();
            }}
          >
            {!triggerDownLoadPDF ? (
              <p>ใบออกเกรด PDF</p>
            ) : (
              <p className="flex gap-1 items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                กำลังดาวโหลด
              </p>
            )}
          </button>
          <button
            className="px-3 bg-white text-sm   hover:bg-green-600 rounded-full h-fit py-0.5 text-green-500 border flex justify-center hover:text-white items-center gap-2"
            onClick={(e) => {
              handleDownloadExcel(Number(row.groupId));
              e.stopPropagation();
            }}
          >
            <p>ใบออกเกรดExcel</p>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoadingPage ? (
        <header className="flex flex-col p-4 border-2 mt-4 rounded-lg w-full">
          <div className="flex gap-12 mt-4">
            <div className="flex justify-center w-full">
              <div className="flex mx-auto justify-between items-center gap-6 w-full p-2 rounded-lg">
                <div className="w-1/6 flex flex-col gap-4 pt-5">
                  <Combobox
                    options={classLevels.map((classData) => ({
                      value: classData,
                      label: classData,
                    }))}
                    buttonLabel="ระดับการศึกษา"
                    onSelect={(selectedClass) =>
                      handleClassLevelChange(selectedClass)
                    }
                  />
                </div>
                <div className="w-1/6 flex flex-col gap-4 pt-5">
                  <Combobox
                    buttonLabel="กรุณาเลือกหลักสูตร"
                    options={(selectedClassLevel === "ปวช"
                      ? vocationalFaculties
                      : diplomaFaculties
                    ).map((item) => ({
                      value: item.facultyName,
                      label: item.facultyName,
                    }))}
                    onSelect={(selected) => handleFacultyChange(selected)}
                    disabled={!selectedClassLevel}
                  />
                </div>
                <div className="w-1/6 flex flex-col gap-4 pt-5">
                  <Combobox
                    buttonLabel="กรุณาเลือกสาขา"
                    options={program.map((program) => {
                      return { value: program, label: program };
                    })}
                    onSelect={(selected) => handleProgramChange(selected)}
                    disabled={!selectedFaculty}
                  />
                </div>
                <div className="w-1/6 flex flex-col p-2 relative">
                  <h1>ภาคเรียน</h1>
                  <Combobox
                    options={term.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    defaultValue="2"
                    buttonLabel="เลือกภาคเรียน"
                    onSelect={(selectedTerm) => setSelectedTerm(selectedTerm)}
                  />
                </div>
                <div className="w-1/6 flex flex-col p-2 relative">
                  <h1>ปีการศึกษา</h1>
                  <Combobox
                    options={yearsList.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    defaultValue={currentYear.toString()}
                    buttonLabel="เลือกปีการศึกษา"
                    onSelect={(selectedYear) => setSelectedYear(selectedYear)}
                  />
                </div>
              </div>
            </div>
            <hr className="bg-black mt-4 text-black" />
          </div>
          <DataTable
            columns={columns}
            data={filteredData.map((item, index) => ({
              ...item,
              index: index + 1,
            }))}
            onRowClick={(item) => {
              onRowClick(item);
            }}
            pagination={10}
          />
        </header>
      ) : (
        <div className="h-screen">

        
        <div className="w-full  mt-2 border-2 border-dashed rounded-md border-gray-400 grid place-items-center py-20 text-3xl text-blue-400 font-semibold items-center">
          <p className="flex gap-2">
            <Loader2 className="h-10 w-10 animate-spin" />
            Loading...
          </p>
        </div></div>
      )}
    </>
  );
}
