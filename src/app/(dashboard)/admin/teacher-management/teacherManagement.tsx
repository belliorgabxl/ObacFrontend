"use client";
import { makeColumns } from "@/components/common/table/makeColumns";
import { DataTable } from "@/components/common/table/tableComponent";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GetAllTeacher } from "@/dto/teacherDto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGetAllTeacherAsync } from "@/api/oldApi/teacher/teacherAPI";
import { TeacherColumn } from "@/resource/admin/teacherData";

const getTeacherData = async () => {
  try {
    return await fetchGetAllTeacherAsync();
  } catch (err) {
    console.error("Error in getTeacherData:", err);
    return [];
  }
};

export function TeacherPage() {
  const router = useRouter();
  const [searchTeacher, setSearchTeacher] = useState<string>("");
  const [teacherDatas, setTeacherDatas] = useState<GetAllTeacher[]>([]);
  const [searchTeacherFilter, setSearchTeacherFilter] = useState<
    GetAllTeacher[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const items = await getTeacherData();
      setTeacherDatas(items);
    };

    fetchData().catch((error) => {
      console.error("Error in useEffect:", error);
    });
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/admin/teacher-management/edit/${id}`);
  };

  const handleDelete = (id: number) => {};

  const handleRowClick = (id: number) => {
    router.push(`/admin/teacher-management/edit/${id}`);
  };

  const columns = makeColumns<TeacherColumn>(
    {
      teacherId: 0,
      thaiName: "",
      thaiLastName: "",
      firstName: "",
      lastName: "",
      facultyName: "",
      email: "",
    },
    "id",
    {
      teacherId: "ID",
      thaiName: "Thai Name",
      thaiLastName: "Thai Surname",
      firstName: "First Name (English)",
      lastName: "Last Name (English)",
      facultyName: "Faculty",
      email: "Email",
    },
    [
      {
        label: "Edit",
        onClick: (teacherId) => handleEdit(Number(teacherId)),
        className: "hover:bg-blue-600 bg-blue-500",
      },
      {
        label: "Delete",
        onClick: (teacherId) => handleDelete(Number(teacherId)),
        className: "hover:bg-red-600 bg-red-500",
      },
    ]
  );

  useEffect(() => {
    if (teacherDatas) {
      const searchMatch = teacherDatas.filter((teacher) => {
        const query = searchTeacher.toLowerCase();
  
        return (
          teacher.firstName?.toLowerCase().includes(query) ||
          teacher.lastName?.toLowerCase().includes(query) ||
          teacher.teacherId?.toString().includes(query) ||
          teacher.thaiName?.toLowerCase().includes(query) ||
          teacher.thaiLastName?.toLowerCase().includes(query) ||
          teacher.facultyName?.toLowerCase().includes(query) ||
          teacher.email?.toLowerCase().includes(query)
        );
      });
  
      setSearchTeacherFilter(searchMatch);
    }
  }, [searchTeacher, teacherDatas]);

  return (
    <header className="mx-4 sm:mx-10 lg:mx-44 p-4 mt-10 ">
      <div
        className="flex justify-between p-4 h-20
      "
      >
        <Badge className="text-sm sm:text-base" variant="outline">
          การจัดการบุคคลกรของคณะอาจารย์
        </Badge>
        <div className="w-1/2 flex gap-12 items-center justify-center">
          <Input
            type="text"
            placeholder="Search..."
            className="w-2/3"
            onChange={(event) => setSearchTeacher(event.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/3 hover:bg-blue-600">
            <a href="/admin/teacherManagement/create">Add Teacher</a>
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={searchTeacherFilter}
        onRowClick={handleRowClick}
        selectedValue="teacherId"
      />
    </header>
  );
}
