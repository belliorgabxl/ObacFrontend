"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AlarmClock } from "lucide-react";
import { fetchPutMethodData } from "@/resource/academics/grading/api/methodPeriodApiData";
import { MethodDto } from "@/dto/methodDto";
import { getMethodViewData } from "@/resource/academics/grading/viewData/methodPeriodViewData";
import { usePathname } from "next/navigation";

export interface ClassSubject {
  id: number;
  year: number;
  term: number;
  subjectName: string | undefined;
}

export function GradingModeComponent() {
  const pathname = usePathname();
  const [classSubjectData, setClassSubjectData] = useState<ClassSubject | null>(
    null
  );
  const [classInfoData, setClassInfoData] = useState<{
    subjectId: number;
    scheduleSubjectId: number;
    room: string;
    term: number;
    groupId: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("subject");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [gradingMode, setGradingMode] = useState<"manual" | "period" | null>(
    null
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch stored data and initialize the state
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    const savedClassSubjectData = localStorage.getItem("classSubjectData");
    const savedClassInfoData = localStorage.getItem("classInfoData");

    // Initialize state based on localStorage data
    if (savedTab) {
      setActiveTab(savedTab);
      if (savedClassInfoData) {
        handleSelectedClassInfo(JSON.parse(savedClassInfoData));
      }
      if (savedClassSubjectData) {
        handleSelectedSubjectData(JSON.parse(savedClassSubjectData));
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (pathname !== "/academic/grads") {
      localStorage.removeItem("activeTab");
      localStorage.removeItem("classSubjectData");
      localStorage.removeItem("classInfoData");
    }
  }, [pathname]);

  const handleSelectedSubjectData = (data: ClassSubject) => {
    setClassSubjectData(data);
    localStorage.setItem("classSubjectData", JSON.stringify(data));
  };

  const handleSelectedClassInfo = (data: {
    subjectId: number;
    scheduleSubjectId: number;
    term: number;
    room: string;
    groupId: number;
  }) => {
    setClassInfoData(data);
    localStorage.setItem("classInfoData", JSON.stringify(data));
  };

  const handleIsActive = () => {
    setIsActive(!isActive);
  };

  const fetchData = async () => {
    try {
      const response: MethodDto[] = await getMethodViewData();
      const editResponse = response.find(
        (item) => item.methodName === "Edit_Score"
      );

      if (editResponse) {
        setIsActive(editResponse.isActive);
        if (!editResponse.isActive) {
          setGradingMode(null);
        } else {
          if (
            editResponse.isAuto &&
            editResponse.startDate &&
            editResponse.endDate
          ) {
            setGradingMode("period");
            setStartTime(editResponse.startDate);
            setEndTime(editResponse.endDate);
          } else {
            setGradingMode("manual");
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch initial method data:", error);
    }
  };
  // console.log(isActive);
  const handleConfirm = async () => {
    if (gradingMode === "period" && (!startTime || !endTime)) {
      alert("กรุณาเลือกวันเวลาเริ่มต้นและสิ้นสุดการกรอกคะแนน");
      return;
    }
    if (gradingMode === "period" && startTime >= endTime) {
      alert("กรุณาเลือกวันเวลาเริ่มต้นและสิ้นสุดการกรอกคะแนนให้ถูกต้อง");
      return;
    }

    const methodData = {
      id: 1,
      methodName: "Edit_Score",
      isAuto: gradingMode === "period",
      startDate: gradingMode === "period" ? startTime : null,
      endDate: gradingMode === "period" ? endTime : null,
      isActive: isActive,
    };
    try {
      await fetchPutMethodData(methodData);
      setIsPopupOpen(false);
      Swal.fire({
        title: "Success!",
        icon: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to update method data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update method data",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex gap-2 items-center justify-end">
        <div
          className="px-10 bg-blue-500 hover:bg-blue-600 rounded-sm h-fit py-1.5  text-white flex justify-center items-center gap-2"
          onClick={() => setIsPopupOpen(true)}
        >
          <AlarmClock className="w-5 h-5" />
          ระบบเปิด/ปิดการกรอกคะแนน
        </div>
      </div>

      {/* Grading Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              ระบบเปิด/ปิดช่วงการลงคะแนน
            </h2>

            {/* Manual Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-900">
                เปิดระบบการกรอกคะแนน (เปิด/ปิด)
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gradingMode === "manual"}
                  onChange={() => {
                    setGradingMode(gradingMode === "manual" ? null : "manual");
                    handleIsActive();
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Period Mode Option */}
            <div className="flex items-center justify-between  mb-4">
              <span className=" text-sm text-gray-900">
                เปิดระบบการกรอกคะแนนตามช่วงเวลา
              </span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gradingMode === "period"}
                  onChange={() => {
                    setGradingMode(gradingMode === "period" ? null : "period");
                    handleIsActive();
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Time Pickers for Period Mode */}
            {gradingMode === "period" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">วันที่เริ่มต้น:</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">วันที่สิ้นสุด:</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded p-2 mt-1"
                  />
                </div>
              </div>
            )}

            {/* Popup Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 duration-200"
                onClick={() => setIsPopupOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 duration-200"
                onClick={handleConfirm}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
