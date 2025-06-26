import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/Combobox/combobox";
import Swal from "sweetalert2";
import { UpdateStudentGrade } from "@/dto/gradingDto";
import { updateGradingStundetData } from "@/resource/academics/grading/api/gradingApiData";

export interface SubjectData {
  subject_name: string;
  subject_code: string;
  credit: string;
  finalGrade: string;
  collectScore: number;
  affectiveScore: number;
  testScore: number;
  gradeId: number;
  remark: string;
}

interface StudentPopupProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  student: { studentCode: string; name: string } | null;
  subjects: SubjectData | null;
}

const remarkOptions = ["ผ.", "ม.ผ.", "ข.ส.", "ข.ร.", "ม.ส."];

export function StudentPopup({
  isOpen,
  onClose,
  student,
  subjects,
}: StudentPopupProps) {
  const [score, setScore] = useState({
    collectScore: 0,
    affectiveScore: 0,
    finalScore: 0,
  });

  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (subjects) {
      setScore({
        collectScore: subjects.collectScore || 0,
        affectiveScore: subjects.affectiveScore || 0,
        finalScore: subjects.testScore || 0,
      });
      setRemark(subjects.remark || "");
    }
  }, [subjects]);

  const handleInputChange = (field: string, value: string) => {
    setScore((prevScore) => ({
      ...prevScore,
      [field]: parseFloat(value) || 0,
    }));
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

  const handleConfirm = async () => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันข้อมูล?",
        text: "คุณจะไม่สามารถแก้ไขข้อมูลได้หลังจากยืนยัน",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed && subjects?.gradeId !== undefined) {
        const finalRemark = remark ? remark : undefined;
        const payload: UpdateStudentGrade = {
          gradeId: subjects.gradeId,
          collectScore: score.collectScore,
          affectiveScore: score.affectiveScore,
          testScore: score.finalScore,
          finalGrade: gradingScorce(
            score.collectScore + score.affectiveScore + score.finalScore
          ),
          totalScore:
            score.collectScore + score.affectiveScore + score.finalScore,
          remark: finalRemark,
        };

        await updateGradingStundetData(payload);

        await Swal.fire({
          title: "อัพเดตสำเร็จ!",
          text: "ข้อมูลของนักเรียนได้รับการอัพเดตแล้ว",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        onClose(false);
        window.location.reload(); // Optional reload after update
      }
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัพเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };
  // console.log(isOpen);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-25 z-50"
          onClick={() => onClose(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h1 className="text-xl font-bold mb-4 flex justify-between">
                {student?.name}
                {subjects?.finalGrade === "0" ||
                (subjects?.remark !== null && subjects?.remark !== "ผ.") ? (
                  <span className="text-red-500">ไม่ผ่าน</span>
                ) : (
                  <span className="text-green-500">ผ่าน</span>
                )}
              </h1>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h1>{subjects?.subject_name || "ไม่มีข้อมูลวิชา"}</h1>
                  <h1>{subjects?.subject_code || "ไม่มีข้อมูล"}</h1>
                </div>
                <div className="flex justify-between">
                  <h1>หน่วยกิต: {subjects?.credit || "0"}</h1>
                  {subjects?.remark !== null ? (
                    <h1>เกรดเดิม: {subjects?.remark}</h1>
                  ) : (
                    <h1>เกรดเดิม: {subjects?.finalGrade || "ไม่มีข้อมูล"}</h1>
                  )}
                </div>

                <div className="p-2">
                  <h1>คะแนนเก็บ</h1>
                  <Input
                    placeholder="คะแนนเก็บ"
                    value={score.collectScore}
                    onChange={(e) =>
                      handleInputChange("collectScore", e.target.value)
                    }
                  />
                </div>

                <div className="p-2">
                  <h1>คะแนนจิตพิสัย</h1>
                  <Input
                    placeholder="คะแนนจิตพิสัย"
                    value={score.affectiveScore}
                    onChange={(e) =>
                      handleInputChange("affectiveScore", e.target.value)
                    }
                  />
                </div>
                <div className="p-2">
                  <h1>คะแนนสอบ</h1>
                  <Input
                    placeholder="คะแนนสอบ"
                    value={score.finalScore}
                    onChange={(e) =>
                      handleInputChange("finalScore", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="p-2">
                <h1>หมายเหตุ</h1>
                <Combobox
                  buttonLabel="หมายเหตุ"
                  options={remarkOptions.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  onSelect={setRemark}
                  defaultValue={subjects?.remark}
                />
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => onClose(false)}
                  variant="outline"
                  className="w-1/4"
                >
                  กลับ
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="w-1/4 bg-blue-500 hover:bg-blue-600"
                >
                  ยืนยัน
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
