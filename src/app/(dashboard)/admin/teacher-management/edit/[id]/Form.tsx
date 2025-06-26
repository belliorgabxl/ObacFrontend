"use client";
import React, { useEffect } from "react";
import { Combobox } from "@/components/common/Combobox/combobox";
import { LabelInput } from "@/components/common/Input/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { fetchGetTeacherByTeacherIdAsync } from "@/api/oldApi/teacher/teacherAPI";
import { GetTeacherByTeacherId } from "@/dto/teacherDto";

interface Props {
  id: number;
}

const getTeacherData = async (id: number) => {
  try {
    return await fetchGetTeacherByTeacherIdAsync(id);
  } catch (err) {
    console.log(err);
  }
};

export default function Form({ id }: Props) {
  const [teachers, setTeacher] = useState<GetTeacherByTeacherId>();
  const facultyData: string[] = [
    "การตลาด",
    "การบัญชี",
    "เทคโนโลยีธุรกิจดิจิทัล",
    "การท่องเที่ยว",
    "ดิจิทัลกราฟฟิก",
  ];

  useEffect(() => {
    getTeacherData(id).then((items) => {
      setTeacher(items);
    });
  }, []);

  const genderData: string[] = ["Male", "Female"];

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const imageFromBackend = teachers?.teacherProfilePicture;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!teachers) {
    return (
      <header className="mx-4 sm:mx-10 lg:mx-44 p-4 mt-10 ">
        <div className="flex flex-col">
          <div>
            <h1>No Teacher Data Found for ID: {id}</h1>
          </div>
        </div>
      </header>
    );
  }

  const SaveChange = async () => {
    try {
        if (!teachers) {
            alert("Teacher data is not set!");
            return;
          }
        const requestBody = {
            teacherId: teachers?.teacherId,
            userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            firstName: teachers?.teacherEngFirstName,
            lastName: teachers?.teacherEngLastName,
            thaiName: teachers?.thaiName,
            thaiLastName: teachers?.thaiLastName,
            gender: teachers?.teacherGender,
            rank: teachers?.teacherRank,
            qualification: teachers?.teacherQualification,
            teacherCode: "some-code", 
            thaiId: "some-thai-id", 
            email: teachers?.teacherEmail,
            phoneNumber: teachers?.teacherPhone,
            address: "some-address", 
            nationality: teachers?.teacherNationality,
            religion: teachers?.teacherReligion,
            hiredDate: "2007-05-05",
            birthDate: "2007-05-05", 
            programId: 0, 
            facultyId: 0, 
            isActive: true, 
          };
          
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_V1}/api/Teacher/UpdateTeacher`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update:", errorData);
        alert("Failed to update data: " + errorData.message || "Unknown error");
        return;
      }
    } catch (err) {
      console.log(err);
      alert("Failed to Save change. Please try again.");
    }
  };

  return (
    <header className="mx-4 sm:mx-10 lg:mx-44 p-4 mt-10 ">
      <div className="flex flex-col">
        <div>
          <Badge className="text-sm sm:text-base" variant="outline">
            เพิ่มบุคคลกรคณะอาจารย์
          </Badge>
        </div>
        {/* name , surname , email */}
        <div className="w-full flex ">
          {/* title name */}
          <div className="flex w-1/6">
            <LabelInput
              label="title"
              type="text"
              htmlFor="title"
              editData={teachers.teacherRank}
            />
          </div>
          {/* input name */}
          <div className="flex w-1/3">
            <LabelInput
              label="name"
              type="text"
              htmlFor="name"
              editData={teachers.thaiName}
            />
          </div>
          {/* input surname */}
          <div className="flex w-1/3">
            <LabelInput
              label="surname"
              type="text"
              htmlFor="surname"
              editData={teachers.thaiLastName}
            />
          </div>
          {/* input gender */}
          <div className="flex w-1/6">
            <div className="flex justify-center items-end w-full">
              <Combobox
                options={genderData.map((gender) => ({
                  value: gender,
                  label: gender,
                }))}
                buttonLabel="Select a Gender"
                onSelect={(selectedGender) =>
                  console.log("Selected:", selectedGender)
                }
                defaultValue={teachers.teacherGender}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex ">
          {/* input name */}
          <div className="flex w-2/6">
            <LabelInput
              label="english name"
              type="text"
              htmlFor="englishName"
              editData={teachers.teacherEngFirstName}
            />
          </div>
          {/* input surname */}
          <div className="flex w-2/6">
            <LabelInput
              label="english surname"
              type="text"
              htmlFor="englishSurName"
              editData={teachers.teacherEngLastName}
            />
          </div>
          {/* input age */}
          {/* editData={teachers.} */}
          <div className="flex w-1/6">
            <LabelInput type="number" label="age" htmlFor="age" />
          </div>

          <div className="flex w-1/6">
            <div className="flex justify-center items-end w-full">
              <Combobox
                options={facultyData.map((faculty) => ({
                  value: faculty,
                  label: faculty,
                }))}
                buttonLabel="Select a Faculty"
                onSelect={(selectedFaculty) =>
                  console.log("Selected:", selectedFaculty)
                }
                defaultValue={teachers.teacherFaculty}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex ">
          {/* input surname */}
          <div className="flex w-1/6">
            <LabelInput
              label="nationality"
              type="text"
              htmlFor="teacherNationality"
              editData={teachers.teacherNationality}
            />
          </div>
          <div className="flex w-1/6">
            <LabelInput
              label="religion"
              type="text"
              htmlFor="religion"
              editData={teachers.teacherReligion}
            />
          </div>
          {/* input phone */}
          <div className="flex w-1/3">
            <LabelInput
              label="phone"
              type="number"
              htmlFor="phone"
              editData={teachers.teacherPhone}
            />
          </div>
          <div className="flex w-1/3">
            <LabelInput
              type="email"
              label="email"
              htmlFor="email"
              editData={teachers.teacherEmail}
            />
          </div>
        </div>
        <div className="w-full flex ">
          {/* input name */}
          <div className="flex w-1/3">
            <LabelInput
              label="qualification"
              type="text"
              htmlFor="qualification"
              editData={teachers.teacherQualification}
            />
          </div>
        </div>
        <div className="grid place-items-end w-full my-10">
          <button
            onClick={SaveChange}
            className="px-5 py-2 bg-blue-500 text-white text-md rounded-md hover:opacity-75"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </header>
  );
}
