"use client";

import { useRouter } from "next/navigation";
import { makeColumns } from "@/components/common/table/makeColumns";
import { DataTable } from "@/components/common/table/tableComponent";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { AcademicColumn } from "@/resource/admin/academicData";
import { fetchGetAllAcademicUser } from "@/api/user/userAPI";
import { GetAllAcademicUser } from "@/dto/userDto";

const getAcademicData = async () => {
  try {
    return await fetchGetAllAcademicUser();
  } catch (err) {
    console.log(err);
    return [];
  }
};

export function AcademicPage() {
  const [academicDatas, setAcademicData] = useState<GetAllAcademicUser[]>([]);
  const [searchStaff, setSearchStaff] = useState<string>("");
  const [searchStaffFilter, setSearchStaffFilter] = useState<
    GetAllAcademicUser[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const items = await getAcademicData();
      setAcademicData(items);
    };
    fetchData().catch((error) => {
      console.error("Error in useEffect:", error);
    });
  }, []);

  const handleEdit = (id: any) => {
    router.push(`/admin/academic-management/edit/${id}`);
  };

  const handleDelete = (id: any) => {
    console.log("Delete", id);
  };

  const handleRowClick = (id: any) => {
    router.push(`/admin/academic-management/edit/${id}`);
  };

  const columns = makeColumns<AcademicColumn>(
    {
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
    },
    "id",
    {
      userId: "ID",
      firstName: "Name",
      lastName: "Surname",
      email: "Email",
    },
    [
      {
        label: "Edit",
        onClick: (userId) => handleEdit(Number(userId)),
        className: "hover:bg-blue-600 bg-blue-500",
      },
      {
        label: "Delete",
        onClick: (userId) => handleDelete(Number(userId)),
        className: "hover:bg-red-600 bg-red-500",
      },
    ]
  );

  useEffect(() => {
    if (Array.isArray(academicDatas)) {
      const searchMatch = academicDatas.filter(
        (staff) =>
          staff.firstName.toLowerCase().includes(searchStaff.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchStaff.toLowerCase()) ||
          staff.userId.toLowerCase().includes(searchStaff.toLowerCase())
      );
      setSearchStaffFilter(searchMatch);
    } else {
      console.error("academicDatas is not an array:", academicDatas);
    }
  }, [searchStaff, academicDatas]);

  return (
    <header className="mx-4 sm:mx-10 lg:mx-44 p-4 mt-10 ">
      <div
        className="flex justify-between p-4 h-20
      "
      >
        <Badge className="text-sm sm:text-base" variant="outline">
          การจัดการบุคคลกรภายใน
        </Badge>
        <div className="w-1/2 flex gap-12 items-center justify-center">
          <Input
            type="text"
            placeholder="Search..."
            className="w-2/3"
            onChange={(event) => setSearchStaff(event.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/3 hover:bg-blue-600">
            <a href="/admin/academic-management/create">Add Staff </a>
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={searchStaffFilter}
        onRowClick={handleRowClick}
        selectedValue="userId"
      />
    </header>
  );
}
