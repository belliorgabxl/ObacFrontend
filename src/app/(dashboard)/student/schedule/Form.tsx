import React, { useEffect, useState } from "react";
import { CardSchedule } from "@/components/common/Card/card-schedule";
import { Badge } from "@/components/ui/badge";
import { StudentCardSubjectData } from "@/resource/students/studentCardSubjectData";
import { fetchGetScheduleOfStudentByStudentID } from "@/api/oldApi/schedule/scheduleAPI";
import { StudentGroupScheduleSubject } from "@/dto/schedule";

type Props = {
  student_id: number;
};

const getScheudleData = async (
  studentId: number,
  term: string,
  year: number
) => {
  try {
    const response = await fetchGetScheduleOfStudentByStudentID(
      studentId,
      term,
      year
    );
    return response;
  } catch (err) {
    console.log("Error fetch in Front-End");
    return [];
  }
};

export default function Form({ student_id }: Props) {
  const [schedules, setSchedules] = useState<StudentGroupScheduleSubject[]>([]);
  const unitCredit = StudentCardSubjectData.reduce(
    (acc, curr) => acc + curr.subject_credit,
    0
  );

  useEffect(() => {
    getScheudleData(student_id, "1", 2024).then((item: any) => {
      setSchedules(item);
    });
  }, []);

  return (
    <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-44 px-16 lg:px-4 py-8">
      <div className="mx-10 w-full items-center text-center text-lg sm:text-xl flex justify-between">
        <Badge className=" lg:text-xl md:text-xl text-md border-[1px] border-gray-300  text-center w-fit md:px-10 lg:px-10 py-1 rounded-md text-white bg-blue-950">
          ตารางเรียน
        </Badge>
        <Badge className="text-sm bg-white font-normal shadow-md shadow-gray-200 hover:bg-gray-100 border border-gray-200  sm:text-base text-gray-500 flex gap-2 mt-2 px-5 sm:mt-0">
          <span className="text-gray-600">{unitCredit}</span>
          หน่วยกิต
        </Badge>
      </div>

      
      {schedules.length > 0 ? (
        <div>
          {schedules?.map((item: StudentGroupScheduleSubject, index) => (
            <div key={index} className="grid gap-2 py-5">
              {item.scheduleSubjects.map((subject, subIndex) => (
                <CardSchedule schedule={subject} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center border text-[24px] mt-5 border-gray-400  text-gray-700 py-10 text-center">
          ไม่มีตารางเรียน
        </div>
      )}

      {/* count number of subject in StudentCardSubjectData */}
      <div className="flex items-end justify-end mt-6 text-sm sm:text-base w-full mx-10">
        <Badge className="text-sm bg-white font-normal shadow-md shadow-gray-200 hover:bg-gray-100 border border-gray-200  sm:text-base text-gray-700 flex  mt-2 px-5 sm:mt-0">
          จำนวนวิชา : &nbsp;{StudentCardSubjectData.length}
        </Badge>
      </div>
    </div>
  );
}
