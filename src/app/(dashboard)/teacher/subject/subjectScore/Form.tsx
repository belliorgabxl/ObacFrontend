"use client";
import React, { useEffect, useState } from "react";
import {
  GetGradBySubjectId,
} from "@/dto/gradDto";
import { Combobox } from "@/components/common/Combobox/combobox";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

interface Props {
  grads?: GetGradBySubjectId[];
  onEdit: boolean | null | undefined;
}

export default function SubjectTableForm({ grads, onEdit }: Props) {
  const [remark, setRemark] = useState<string>("");
  const [gradDatas, setGradData] = useState<GetGradBySubjectId[]>([]);
  useEffect(() => {
    const sortedData = [...(grads ?? [])].sort(
      (a, b) => a.studentId - b.studentId
    );
    setGradData(sortedData);
  }, [grads]);
  const handleInputChange = (
    index: number,
    field: keyof GetGradBySubjectId,
    value: string
  ) => {
    const updatedStudents = [...gradDatas];
    (updatedStudents[index] as any)[field] = parseFloat(value) || 0;
    setGradData(updatedStudents);
  };
  const token = Cookies.get("token");
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
        const payload = gradDatas.map((item) => ({
          gradeId: item.gradeId,
          collectScore: item.collectScore,
          affectiveScore: item.affectiveScore,
          testScore: item.testScore,
          totalScore:
            (item.affectiveScore ?? 0) +
            (item.collectScore ?? 0) +
            (item.testScore ?? 0),
          remark: item.remark,
        }));
        for (let i = 0; i < payload.length; i++) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_V1}/Grade/UpdateStudentGrade`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload[i]),
            }
          );
          const responseBody = await response.json();

          if (!response.ok) {
            throw new Error(
              responseBody.message || "Failed to update student grades"
            );
          }
        }
      }

      toast.success("บันทึกคะแนนสำเร็จ");
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
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

  const onChangeGrade = (value: string) => {};

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
  const onChangeRemark = (value: string, studentId: number) => {
    gradDatas.map((item) => {
      if (item.studentId === studentId) {
        item.remark = value;
      }
    });
  };

  return (
    <div className="w-full px-5 ">
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
        <span className="grid place-items-center text-xl  py-2">คะแนนรวม</span>
        <span className="grid place-items-center  text-xl py-2">เกรด</span>
        <span className="grid place-items-center text-xl  py-2">หมายเหตุ</span>
      </div>
      {gradDatas?.map((item, index) => (
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
            disabled={onEdit != true}
            type="number"
            value={item.collectScore ?? 0}
            min={0}
            max={50}
            className={` text-center enabled:bg-blue-50   bg-white focus:outline-blue-500 py-2  group-hover:bg-[#e8f3ff] ${
              (item.collectScore ?? 0) > 50 || (item.collectScore ?? 0) < 0
                ? "outline-red-500 border-red-500 rounded-md border-[3px]"
                : "border-gray-300 border-r-2"
            }`}
            onChange={(e) =>
              handleInputChange(index, "collectScore", e.target.value)
            }
          />
          <input
            disabled={!onEdit}
            type="number"
            value={item.affectiveScore ?? 0}
            min={0}
            max={20}
            className={`text-center enabled:bg-blue-50   focus:outline-blue-500  py-2 group-hover:bg-[#e8f3ff]  bg-white  ${
              (item.affectiveScore ?? 0) > 20 || (item.affectiveScore ?? 0) < 0
                ? "border-red-500 outline-red-500 rounded-md border-[3px]"
                : "border-gray-300 border-r-2"
            }`}
            onChange={(e) =>
              handleInputChange(index, "affectiveScore", e.target.value)
            }
          />
          <input
            disabled={onEdit != true}
            type="number"
            value={item.testScore ?? 0}
            min={0}
            max={30}
            className={`text-center enabled:bg-blue-50   bg-white  focus:outline-blue-500  py-2 group-hover:bg-[#e8f3ff] ${
              (item.testScore ?? 0) > 30 || (item.testScore ?? 0) < 0
                ? "rounded-md outline-red-500 border-red-500  border-[3px]"
                : "border-gray-300 border-r-2"
            }`}
            onChange={(e) =>
              handleInputChange(index, "testScore", e.target.value)
            }
          />
          <span className="text-center flex justify-center items-center border-r-2 py-2">
            {(item.collectScore ?? 0) +
              (item.testScore ?? 0) +
              (item.affectiveScore ?? 0)}
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
                onSelect={(selectedGrade) => onChangeGrade(selectedGrade)}
                defaultValue={
                  item.remark
                    ? item.remark
                    : gradingScorce(
                        (item?.collectScore ?? 0) +
                          (item?.testScore ?? 0) +
                          (item?.affectiveScore ?? 0)
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
              defaultValue={item.remark || ""}
            />
          </div>
        </div>
      ))}
      <div className="my-5 w-full grid place-items-end  ">
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
  );
}
