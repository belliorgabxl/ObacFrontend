import { LabelText } from "@/components/common/labelText/labelText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentRegisterData } from "@/dto/registerDto";
import { registerData } from "@/resource/academics/registerStudentInfo/mock";
import { User } from "lucide-react"; // Profile icon

export function RegisterPopUp(props: {
  registerId: number;
  onClose: () => void;
}) {
  const data: StudentRegisterData | undefined = registerData.find(
    (item) => item.runningNumber === props.registerId
  );

  if (!data) {
    return null; // Handle case where data is undefined
  }
  const name = `${data.thaiName} ${data.thaiSurname}`;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 z-10"
        onClick={props.onClose}
      >
        <div
          className="bg-white shadow-lg shadow-gray-400 rounded-lg w-3/4 z-100 p-6 overflow-y-auto h-[calc(100%-2rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile icon at center */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
          </div>

          {/* Student Info */}
          <Tabs
            defaultValue="profile"
            className="w-full z-10 min-h-dvh rounded-md"
          >
            <TabsList className="rounded-sm sticky  ">
              <TabsTrigger value="profile">ข้อมูลทั่วไป</TabsTrigger>
              <TabsTrigger value="education">ข้อมูลการศึกษา</TabsTrigger>
              <TabsTrigger value="address">ข้อมูลที่อยู่</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="ml-6 p-2 text-sm">
              <div className="space-y-4 mx-20">
                {/* Name */}
                <LabelText topic="ชื่อ-นามสกุล" data={name} />

                {/* Gender */}
                <LabelText topic="เพศ" data={data.gender} />

                {/* Birth Date */}
                <LabelText topic="วัน/เดือน/ปี เกิด" data={data.birthDate} />

                {/* Thai ID */}
                <LabelText topic="เลขบัตรประชาชน" data={data.thaiId} />

                {/* Email */}
                <LabelText topic="email" data={data.email} />

                {/* Phone Number */}
                <LabelText topic="เบอร์โทร" data={data.phoneNumber} />

                {/* Nationality */}
                <LabelText topic="สัญชาติ" data={data.nationality} />

                {/* Religion */}
                <LabelText topic="ศาสนา" data={data.religion} />
              </div>
            </TabsContent>

            <TabsContent value="education" className="ml-6 p-2 text-sm">
              <div className="space-y-4 mx-20">
                {/* Faculty */}
                <LabelText topic="หลักสูตร" data={data.facultyName} />

                {/* Program */}
                <LabelText topic="สาขา" data={data.programName} />
              </div>
            </TabsContent>

            <TabsContent value="address" className="ml-6 p-2 text-sm">
              <div className="space-y-4 mx-20">
                {/* Address */}
                <LabelText topic="ที่อยู่" data={data.address} />
              </div>
            </TabsContent>
            <div className="flex justify-between">
              <div className="mt-6 text-left">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={props.onClose}
                >
                  Accept
                </button>
              </div>
              {/* Close Button */}
              <div className="mt-6 text-right">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={props.onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
