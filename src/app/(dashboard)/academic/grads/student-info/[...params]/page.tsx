"use client";
import { fetchUpdateCompleteScheduleSubject } from "@/api/oldApi/grad/gradAPI";
import { fetchGetSubjectBySubjectId } from "@/api/oldApi/subject/subjectAPI";
import GenStudentNameInSubject from "@/lib/PDF/genStudentNameInSubject";
import GenSubjectScore from "@/lib/PDF/genSubjectScore";
import { Combobox } from "@/components/common/Combobox/combobox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GetGradBySubjectId } from "@/dto/gradDto";
import { GetSubjectBySubjectId } from "@/dto/subjectDto";
import {
  ConvertClassroomToExcelWithSubject,
  ConvertScoreToExcel,
} from "@/lib/convertToExcel";
import { updateGradingStundetData } from "@/resource/academics/grading/api/gradingApiData";
import { getSubjectBySubjectIdViewData } from "@/resource/academics/grading/viewData/academicStudentViewData";
import { CircleX, ClipboardCheck, Pencil, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { GradingModeComponent } from "../../../../../(dashboard)/academic/grads/components/GradingModeComponent";

const AcademicStudentInfo = ({ params }: { params: { params: string[] } }) => {
  const subjectId = params.params[0];
  const scheduleSubjectId = params.params[1];
  // const classInfo = params.params[2];
  const term = params.params[2];
  const studentGroupId = params.params[3];
  const year = params.params[4];

  const [subjectByGroupId, setSchedules] = useState<GetSubjectBySubjectId>();
  const [searchStudent, setSearchStudent] = useState<string>("");

  const [gradDatas, setGradData] = useState<GetGradBySubjectId[]>([]);
  const [gradDataFilter, setGradDataFilter] = useState<GetGradBySubjectId[]>(
    []
  );
  const [roomName, setRoomName] = useState<string>("");

  console.log(subjectByGroupId);
  console.log(gradDatas);

  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [verifyGradPopUp, setVerifyGradPopUp] = useState<boolean>(false);

  const handleEdit = () => {
    setOnEdit(true);
  };
  const handleNotEdit = () => {
    setOnEdit(false);
    setGradDataFilter([...gradDatas]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const grads = await getSubjectBySubjectIdViewData(
          Number(studentGroupId),
          Number(term),
          Number(year),
          Number(subjectId)
        );
        setGradData(grads ?? []);
        const sortedGrads = (grads ?? []).sort((a, b) =>
          a.studentCode.localeCompare(b.studentCode)
        );
        setGradDataFilter(sortedGrads);

        setRoomName(`${sortedGrads[0]?.class}.${sortedGrads[0]?.studentGroup}`);

        const schedule: GetSubjectBySubjectId =
          await fetchGetSubjectBySubjectId(Number(subjectId));
        setSchedules(schedule);
      } catch (error) {
        console.error("Error fetching grad data:", error);
        setGradData([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const normalizedSearch = searchStudent.toLowerCase();
    const filteredData = gradDatas.filter(
      (item) =>
        item.studentCode.toLowerCase().includes(normalizedSearch) ||
        item.firstName.toLowerCase().includes(normalizedSearch) ||
        item.lastName.toLowerCase().includes(normalizedSearch)
    );
    setGradDataFilter(filteredData);
  }, [gradDatas, searchStudent, subjectByGroupId]);

  const handleInputChange = (
    index: number,
    field: keyof GetGradBySubjectId,
    value: string
  ) => {
    const updatedStudents = gradDataFilter.map((student) => ({ ...student }));

    updatedStudents[index][field] = parseFloat(value) || 0;

    setGradDataFilter(updatedStudents);
  };

  const convertGrad = gradDataFilter.map((item) => {
    const genderPrefix = item.gender === "Male" ? "นาย" : "นางสาว";
  
    return {
      studentCode: item.studentCode,
      name: `${genderPrefix} ${item.firstName} ${item.lastName}`,
      collectScore: item.collectScore,
      testScore: item.testScore,
      affectiveScore: item.affectiveScore,
      totalScore: item.collectScore + item.testScore + item.affectiveScore,
    };
  });
  
  const covertStudentExcel = gradDataFilter.map((item) => {
    const genderPrefix = item.gender === "Male" ? "นาย" : "นางสาว";
  
    return {
      studentCode: item.studentCode,
      name: `${genderPrefix} ${item.firstName} ${item.lastName}`,
    };
  });
  const CompleteGrade = async () => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใช้ไหมที่จะยืนยันการตรวจสอบคะแนน?",
        text: "เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้ กรุณาทบทวนข้อมูอีกครั้งก่อนตกลง",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "ไม่",
        confirmButtonText: "ใช่",
      });

      if (result.isConfirmed) {
        const response = await fetchUpdateCompleteScheduleSubject(
          Number(scheduleSubjectId)
        );
        if (response.success) {
          toast.success("ตรวจสำเร็จ");
        } else {
          toast.error("ผิดพลาด");
        }
      }

      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save grades. Please try again.");
    }
  };

  const saveChanges = async () => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันข้อมูล?",
        text: "จะไม่สามารถแก้ไขได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      });

      if (result.isConfirmed) {
        const payload = gradDataFilter.map((item) => ({
          gradeId: item.gradeId ?? 0,
          collectScore: item.collectScore,
          testScore: item.testScore,
          affectiveScore: item.affectiveScore,
          finalGrade: gradingScorce(
            item.collectScore + item.testScore + item.affectiveScore
          ),
          totalScore: item.affectiveScore + item.collectScore + item.testScore,
          remark: item.remark,
        }));

        for (let i = 0; i < payload.length; i++) {
          try {
            const response = await updateGradingStundetData(payload[i]);
          } catch (error) {
            console.error("Error saving changes:", error);
          }
        }
        setOnEdit(!onEdit);
        toast.success("บันทึกคะแนนสำเร็จ");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save grades. Please try again.");
    }
  };

  const onChangeGrade = (value: string, studentId: number) => {
    gradDataFilter.map((item) => {
      if (item.studentId === studentId) {
        item.finalGrade = value;
      }
    });
  };

  const onChangeRemark = (value: string, studentId: number) => {
    gradDataFilter.map((item) => {
      if (item.studentId === studentId) {
        item.remark = value;
      }
    });
  };

  const gradeValue = [
    "0",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "ผ.",
    "มผ.",
    "ขส.",
    "ขร.",
    "มส.",
  ];

  const remarkValue = ["ผ.", "มผ.", "ขส.", "ขร.", "มส."];

  const gradingScorce = (totalScore: number) => {
    if (totalScore >= 80) return "4";
    if (totalScore >= 75) return "3.5";
    if (totalScore >= 70) return "3";
    if (totalScore >= 65) return "2.5";
    if (totalScore >= 60) return "2";
    if (totalScore >= 55) return "1.5";
    if (totalScore >= 50) return "1";
    return "0";
  };

  return (
    <div className="mx-4 sm:px-5 lg:px-10 p-4">
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
      <div className="w-full mt-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Badge variant={"outline"} className="text-xl">
              วิชา :
              <span className="font-semibold ml-2">
                {subjectByGroupId?.subjectName}
              </span>
            </Badge>
            <Badge variant={"outline"} className="ml-4 text-xl">
              รหัสวิชา :
              <span className="font-semibold ml-2">
                {subjectByGroupId?.subjectCode}
              </span>
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={!roomName}
              className="text-md bg-[#e4f1f8] text-gray-600 hover:bg-gray-200 rounded-md px-5 py-2"
              onClick={() => {
                GenSubjectScore({
                  grads: gradDataFilter,
                  studentGroup: roomName,
                  subjectId: subjectByGroupId?.subjectCode,
                  subjectName: subjectByGroupId?.subjectName,
                });
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดใบคะแนน PDF</p>
            </button>
            <button
              className=" text-md text-gray-600 hover:bg-gray-200 bg-[#e4f1f8] rounded-md px-5 py-2"
              onClick={() => {
                GenStudentNameInSubject({
                  grads: gradDataFilter,
                  studentGroup: roomName,
                  subjectId: subjectByGroupId?.subjectCode,
                  subjectName: subjectByGroupId?.subjectName,
                });
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดรายชื่อ PDF</p>
            </button>
            <button
              className=" text-md text-gray-600 hover:bg-gray-200 bg-[#e4f1f8] rounded-md px-5 py-2"
              onClick={async () => {
                ConvertScoreToExcel(
                  convertGrad,
                  String(term ?? ""),
                  String(year ?? ""),
                  subjectByGroupId?.subjectCode || "",
                  subjectByGroupId?.subjectName || "",
                  roomName || ""
                );
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดใบคะแนน Excel</p>
            </button>
            <button
              className=" text-md text-gray-600 hover:bg-gray-200 bg-[#e4f1f8] rounded-md px-5 py-2"
              onClick={async () => {
                ConvertClassroomToExcelWithSubject(
                  covertStudentExcel,
                  subjectByGroupId?.subjectCode || "",
                  subjectByGroupId?.subjectName || "",
                  roomName || ""
                );
              }}
            >
              <p className="line-clamp-1">ดาวน์โหลดใบรายชื่อ Excel</p>
            </button>
          </div>
        </div>
        <div className="w-full flex justify-between  items-center ">
          <div className="bg-white w-1/3 py-2">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pr-10"
              onChange={(event) => setSearchStudent(event.target.value)}
            />
          </div>
          <div className="w-2/3 flex gap-6 justify-end">
            {onEdit ? (
              <button
                className={`bg-red-500 duration-300 text-white h-fit text-center text-lg rounded-md hover:opacity-75 flex items-center justify-center gap-2 w-[120px] py-1 hover:rounded-sm `}
                onClick={handleNotEdit}
              >
                ยกเลิก
                <CircleX
                  style={{ width: "1.0rem", height: "1.5rem" }}
                  className="text-white"
                />
              </button>
            ) : (
              <button
                className={`bg-blue-400 duration-300 h-fit text-white  text-lg    rounded-md hover:opacity-75 w-[120px]  gap-2 flex items-center justify-center text-center py-1 hover:rounded-sm `}
                onClick={handleEdit}
              >
                แก้ไข
                <Pencil
                  style={{ width: "1.0rem", height: "1.5rem" }}
                  className="text-white "
                />
              </button>
            )}
          </div>
        </div>
        <div className="w-full ">
          <div className="  bg-[#cfe4ff] grid grid-cols-[5%_10%_25%_10%_10%_10%_10%_10%_10%] border-2 border-gray-400">
            <span className="grid place-items-center text-xl py-2">No.</span>
            <span className="grid place-items-center text-xl  py-2">
              รหัสนักเรียน
            </span>
            <span className="grid place-items-center text-xl  py-2">
              ชื่อ - นามสกุล
            </span>
            <span className="text-center   pt-2 pb-1">
              <div className="text-xl">คะแนนเก็บ</div>
              <div className="text-md text-gray-600">50 คะแนน</div>
            </span>
            <span className="text-center  pt-2 pb-1">
              <div className="text-xl">คะแนนจิตพิสัย</div>
              <div className="text-md text-gray-600">20 คะแนน</div>
            </span>
            <span className="text-center  pt-2 pb-1">
              <div className="text-xl">คะแนนสอบ</div>
              <div className="text-md text-gray-600">30 คะแนน</div>
            </span>
            <span className="grid place-items-center text-xl  py-2">
              คะแนนรวม
            </span>
            <span className="grid place-items-center  text-xl py-2">เกรด</span>
            <span className="grid place-items-center text-xl  py-2">
              หมายเหตุ
            </span>
          </div>
          {gradDataFilter?.map((item, index) => (
            <div
              className=" text-lg border-b-2  grid group hover:bg-[#e8f3ff]   grid-cols-[5%_10%_25%_10%_10%_10%_10%_10%_10%]"
              key={item.studentId}
            >
              <span className="text-center font-semibold border-l-2 border-r-2 py-2">
                {index + 1}.
              </span>
              <span className="text-center border-r-2 py-2">
                {item.studentCode}
              </span>
              <span className="text-start pl-5 border-r-2 py-2">
                {item.firstName} {item.lastName}
              </span>
              <input
                disabled={onEdit != true || item.remark !== null}
                type="number"
                value={item.collectScore}
                min={0}
                max={50}
                className={` text-center enabled:bg-blue-50   bg-white focus:outline-blue-500 py-2  group-hover:bg-[#e8f3ff] ${
                  item.collectScore > 50 || item.collectScore < 0
                    ? "outline-red-500 border-red-500 rounded-md border-[3px]"
                    : "border-gray-300 border-r-2"
                }`}
                onChange={(e) =>
                  handleInputChange(index, "collectScore", e.target.value)
                }
              />
              <input
                disabled={!onEdit || item.remark !== null}
                type="number"
                value={item.affectiveScore}
                min={0}
                max={20}
                className={`text-center enabled:bg-blue-50   focus:outline-blue-500  py-2 group-hover:bg-[#e8f3ff]  bg-white  ${
                  item.affectiveScore > 20 || item.affectiveScore < 0
                    ? "border-red-500 outline-red-500 rounded-md border-[3px]"
                    : "border-gray-300 border-r-2"
                }`}
                onChange={(e) =>
                  handleInputChange(index, "affectiveScore", e.target.value)
                }
              />
              <input
                disabled={onEdit != true || item.remark !== null}
                type="number"
                value={item.testScore}
                min={0}
                max={30}
                className={`text-center enabled:bg-blue-50   bg-white  focus:outline-blue-500  py-2 group-hover:bg-[#e8f3ff] ${
                  item.testScore > 30 || item.testScore < 0
                    ? "rounded-md outline-red-500 border-red-500  border-[3px]"
                    : "border-gray-300 border-r-2"
                }`}
                onChange={(e) =>
                  handleInputChange(index, "testScore", e.target.value)
                }
              />
              <span className="text-center flex justify-center items-center border-r-2 py-2">
                {item.collectScore + item.testScore + item.affectiveScore}
              </span>
              <span className="text-center bg-gray-100 group-hover:bg-[#cae2fa] font-semibold text-lg border-r-2 ">
                <div className="flex justify-center px-2 py-1">
                  <Combobox
                    buttonLabel="เกรด"
                    disabled={true}
                    options={gradeValue.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    onSelect={(selectedGrade) =>
                      onChangeGrade(selectedGrade, item.studentId)
                    }
                    defaultValue={
                      item.remark
                        ? item.remark
                        : gradingScorce(
                            item.collectScore +
                              item.testScore +
                              item.affectiveScore
                          )
                    }
                  />
                </div>
              </span>
              <div className="flex justify-center px-2 py-1">
                <Combobox
                  buttonLabel="หมายเหตุ"
                  disabled={!onEdit}
                  options={remarkValue.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  onSelect={(selectedGrade) =>
                    onChangeRemark(selectedGrade, item.studentId)
                  }
                  defaultValue={item.remark}
                />
              </div>
            </div>
          ))}
          <div className="my-5 w-full flex justify-between items-center  ">
            <button
              className="bg-blue-500 duration-300 h-fit px-5 text-white text-lg rounded-full hover:bg-blue-700 w-fit  gap-2 flex items-center justify-center text-center py-1 hover:scale-105 whitespace-nowrap"
              onClick={() => setVerifyGradPopUp(true)}
            >
              ยืนยันการตรวจสอบคะแนน{" "}
              <ClipboardCheck
                style={{ width: "1.5rem", height: "1.8rem" }}
                className="text-white"
              />
            </button>
            <button
              onClick={saveChanges}
              disabled={!onEdit}
              className="px-4 py-2  enabled:bg-green-500 enabled:hover:bg-green-300 duration-300   bg-green-300 text-white rounded hover:bg-green-300"
            >
              บันทึกคะแนน
            </button>
          </div>
          <hr />
        </div>
        {verifyGradPopUp && (
          <div
            className="fixed duration-1000 animate-appearance-in inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
            onClick={() => setVerifyGradPopUp(false)}
          >
            <div
              className="bg-white shadow-lg shadow-gray-400   rounded-lg w-[400px] z-100 duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-4 w-full text-center text-2xl font-semibold">
                ยืนยันการตรวจ
              </div>
              <div className="grid place-items-center py-3">
                <p className="w-[300px] text-center">
                  โปรดตรวจสอบให้แน่ใจว่าคะแนนถูกต้อง
                </p>
                <p className="text-gray-600 w-[300px] text-center">
                  หากเกิดความผิดพลาดอาจทำให้เกิดความล่าช้าในการประมวลผลเกรด
                </p>
              </div>
              <div className="flex gap-5 justify-center py-5 w-full">
                <button
                  className="text-sm w-[90px] py-1.5 bg-gray-300 hover:bg-gray-400 rounded-md text-black "
                  onClick={() => setVerifyGradPopUp(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="text-sm w-[90px] py-1.5 bg-blue-500 hover:bg-blue-600 rounded-md text-white "
                  onClick={CompleteGrade}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicStudentInfo;
