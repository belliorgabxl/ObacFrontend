"use client";

import { LabelInput } from "@/components/common/Input/input";
import { Badge } from "@/components/ui/badge";
import { StudentCreateData } from "@/dto/studentDto";
import { useState } from "react";
import { Combobox } from "@/components/common/Combobox/combobox";
import { fetchCreateStudentAsync } from "@/api/oldApi/student/studentApi";
import { useRouter } from "next/navigation";
export function RegisterStudent() {
  const router = useRouter();
  const [createStudentData, setCreateStudentData] = useState<StudentCreateData>(
    {
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
      thaiName: "",
      thaiLastName: "",
      gender: "",
      studentGroupId: 0,
      studentCode: "",
      thaiId: "",
      email: "",
      phoneNumber: "",
      address: "",
      nationality: "",
      religion: "",
      class: "",
      enrollYear: 0,
      currentYear: 0,
      graduateYear: 0,
      currentRoom: "",
      programId: 0,
      facultyId: 0,
      birthDate: new Date(),
    }
  );

  // fetchCreate Student
  const handelSubmit = async () => {
    await fetchCreateStudentAsync(createStudentData);
    // router.push("/home/");
  };

  const [booleanThaiId, setBooleanThaiId] = useState<boolean | null>(null);
  const validateThaiIdData = (id: string) => {
    if (!/^\d{13}$/.test(id)) {
      setBooleanThaiId(false); // รหัสบัตรประชาชนไม่ถูกต้อง
    } else {
      setBooleanThaiId(true);
      handleChange("thaiId", id);
    }
  };

  const handleChange = (
    key: keyof StudentCreateData,
    value: string | number | Date
  ) => {
    setCreateStudentData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const genderData: string[] = ["Male", "Female"];
  return (
    <div className="mx-4 sm:mx-10 lg:mx-44 p-4 mt-10 flex-col">
      <div className="items-center text-center p-4 text-lg sm:text-xl flex flex-col sm:flex-row justify-between">
        <Badge className="text-sm sm:text-lg" variant="outline">
          ลงทะเบียนนักเรียน
        </Badge>
      </div>
      {/* inform */}
      <div className="flex flex-col gap-6 p-4">
        <div className="w-1/6">
          <h1>ข้อมูลทั่วไป</h1>
        </div>
        <div className="w-full flex">
          {/* name */}
          <div className="flex w-1/3">
            <LabelInput
              label="Thai Name"
              type="text"
              htmlFor="name"
              onEdit={(name) => handleChange("thaiName", name)}
            />
          </div>

          {/* surname */}
          <div className="flex w-1/3">
            <LabelInput
              label="Thai Surname"
              type="text"
              htmlFor="surname"
              onEdit={(surname) => handleChange("thaiLastName", surname)}
            />
          </div>
          {/* gender */}
          <div className="flex w-1/6">
            <div className="flex justify-center items-end w-full p-2">
              <Combobox
                options={genderData.map((gender) => ({
                  value: gender,
                  label: gender,
                }))}
                buttonLabel="Select a Gender"
                onSelect={(selectedGender) =>
                  handleChange("gender", selectedGender)
                }
              />
            </div>
          </div>
          {/* age */}
          <div className="flex w-1/6">
            <LabelInput
              label="Birth Date"
              type="date"
              htmlFor="birthDate"
              onEdit={(value) => handleChange("birthDate", value)}
            />
          </div>
        </div>
        <div className="w-full flex">
          {/* english name */}
          <div className="flex w-1/3">
            <LabelInput
              label="English Name"
              type="text"
              htmlFor="firstName"
              onEdit={(name) => handleChange("firstName", name)}
            />
          </div>

          {/* english surname */}
          <div className="flex w-1/3">
            <LabelInput
              label="English Surname"
              type="text"
              htmlFor="lastName"
              onEdit={(surname) => handleChange("lastName", surname)}
            />
          </div>
          <div className="w-1/3">
            <LabelInput
              label="รหัสบัตรประชาชน"
              type="text"
              htmlFor="thaiId"
              onEdit={(thaiId) => validateThaiIdData(thaiId)}
              maxLength={13}
              isValid={booleanThaiId !== null ? booleanThaiId : true}
              errorMessage="รหัสบัตรประชาชนไม่ถูกต้อง"
            />
          </div>
        </div>
        <div className="w-full flex gap-10">
          <div className="w-1/4">
            <LabelInput
              label="Email"
              type="email"
              htmlFor="email"
              onEdit={(email) => handleChange("email", email)}
            />
          </div>
          <div className="w-1/4">
            <LabelInput
              label="Phone Number"
              type="text"
              htmlFor="phoneNumber"
              onEdit={(phoneNumber) => handleChange("phoneNumber", phoneNumber)}
            />
          </div>
          <div className="w-1/4">
            <LabelInput
              label="Nationality"
              type="text"
              htmlFor="nationality"
              onEdit={(nationality) => handleChange("nationality", nationality)}
            />
          </div>
          <div className="w-1/4">
            <LabelInput
              label="Religion"
              type="text"
              htmlFor="religion"
              onEdit={(religion) => handleChange("religion", religion)}
            />
          </div>
        </div>
        <hr className="mt-4 bg-black" />

        <div className="w-1/6">
          <h1>ข้อมูลที่อยู่ตามทะเบียนบ้าน</h1>
        </div>
        {/* address */}
        <div className="mt-4 w-4/6 ml-2">
          <label
            htmlFor="Address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <textarea
            id="Address"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your address here..."
          ></textarea>
        </div>

        <hr className="mt-4 bg-black" />

        {/* faculty */}

        {/* programId */}

        <div className="flex justify-end">
          <button
            onClick={handelSubmit}
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            ส่งรายละเอียดข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}
