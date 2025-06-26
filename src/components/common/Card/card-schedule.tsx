import { ScheduleSubject } from "@/dto/schedule";
// import { studentCardSubjectProps } from "@/resource/students/studentCardSubjectData";

type Props = {
  schedule: ScheduleSubject;
};

export function CardSchedule({ schedule }: Props) {
  const dayColorMap: { [key: string]: string } = {
    วันจันทร์: "bg-gradient-to-r from-yellow-200 via-orange-200 to-orange-100 ",
    วันอังคาร: "bg-gradient-to-r from-pink-200 via-pink-300 to-red-100 ",
    วันพุธ: "bg-gradient-to-r from-green-200 via-emerald-300 to-yellow-100",
    วันพฤหัสบดี:
      "bg-gradient-to-r from-orange-200 via-orange-300 to-yellow-100",
    วันศุกร์: "bg-gradient-to-r from-sky-200 via-blue-300 to-purple-200",
    วันเสาร์: "bg-purple-200",
    วันอาทิตย์: "bg-red-200",
  };

  const dayColorClass = dayColorMap[schedule.day] || "bg-slate-400";

  return (
    <div className="lg:flex shadow-md shadow-gray-200 border border-gray-200 rounded-lg overflow-hidden lg:h-[90px]">
      <div
        className={`grid place-items-center ${dayColorClass} bg-opacity-80 text-gray-500  lg:h-auto lg:w-[250px] h-fit `}
      >
        <div className="flex items-center justify-between w-full px-5 lg:px-0  md:text-center lg:grid lg:justify-center    sm:text-center  text-sm sm:text-base py-1 text-gray-500">
          <div className="text-xl w-full  text-center font-semibold">
            {schedule.day}
          </div>
          <div className="w-full text-center">{schedule.room}</div>
        </div>
      </div>
      <div className="grid grid-rows-2 lg:grid-rows-1 lg:items-center lg:grid-cols-[50%_50%]  w-full text-sm gap-2 px-4 py-4 lg:py-10 ">
        <div className="flex gap-2 lg:gap-4 lg:pl-10  lg:h-full line-clamp-1 h-fit lg:p-4">
          <div className="flex items-center text-gray-600 justify-start lg:justify-center font-semibold">
            {schedule.subjectCode}
          </div>
          <p className="flex text-gray-600  font-semibold text-start text-sm md:text-xl md:text-left items-center">
            {schedule.subjectName}
          </p>
        </div>
        <div className="flex justify-between line-clamp-1 h-fit">
          <div className="flex gap-1 lg:text-lg text-gray-600  lg:gap-3 md:gap-2">
            <p className="font-semibold ">อาจารย์ผู้สอน:</p>
            <span>{schedule.teacherName}</span>
          </div>
          <div className="flex px-2 text-gray-600   items-center  font-semibold">
            {schedule.teacherLastName} หน่วยกิต
          </div>
        </div>
      </div>
    </div>
  );
}
