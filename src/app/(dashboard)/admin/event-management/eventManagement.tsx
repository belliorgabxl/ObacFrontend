"use client";

import { makeColumns } from "@/components/common/table/makeColumns";
import { DataTable } from "@/components/common/table/tableComponent";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { GetEventManagement } from "@/dto/eventDto";
import { exampleEventManagementData } from "@/resource/admin/eventManagemnt/eventManagementData";
import React, { useEffect, useState } from "react";

export function EventManagement() {
  const [searchEvent, setSearchEvent] = useState<string>("");

  const [GetEventManagement, setGetEventManagement] = useState<
    GetEventManagement[]
  >([]);
  const [searchEventFilter, setSearchEventFilter] = useState<
    GetEventManagement[]
  >([]);

  const handleEdit = (id: any) => {
    console.log("Edit", id);
  };
  const handleDelete = (id: any) => {
    console.log("Delete", id);
  };

  const columns = makeColumns<GetEventManagement>(
    {
      blogId: 0,
      blogName: "",
      description: "",
      startDate: "",
      endDate: "",
      //   author: "",
    },
    "blogId",
    {
      blogId: "ID",
      blogName: "Event Name",
      description: "Description",
      startDate: "Start Date",
      endDate: "End Date",
      //   author: "Author",
    },
    [
      {
        label: "Edit",
        onClick: (id) => handleEdit(id),
        className: "hover:bg-blue-600 bg-blue-500",
      },
      {
        label: "Delete",
        onClick: (id) => handleDelete(id),
        className: "hover:bg-red-600 bg-red-500",
      },
    ]
  );

  useEffect(() => {
    setGetEventManagement(exampleEventManagementData);
    setSearchEventFilter(exampleEventManagementData);
  }, []);

  useEffect(() => {
    if (Array.isArray(GetEventManagement)) {
      const searchMatch = GetEventManagement.filter((event) => {
        return (
          event.blogName.toLowerCase().includes(searchEvent.toLowerCase()) ||
          event.description.toLowerCase().includes(searchEvent.toLowerCase()) ||
          event.startDate.toLowerCase().includes(searchEvent.toLowerCase()) ||
          event.endDate.toLowerCase().includes(searchEvent.toLowerCase())
        );
      });
      setSearchEventFilter(searchMatch);
    }
  }, [searchEvent, GetEventManagement]);

  return (
    <>
      {/* topic of page */}
      <div className="flex justify-between">
        <Badge variant={"outline"} className="text-sm sm:text-base">
          Event Management
        </Badge>
        <div className="flex gap-4">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Search..."
              className=""
              onChange={(event) => setSearchEvent(event.target.value)}
            />
          </div>

          <div className="w-4/5">
            <a href="/admin/event-management/create">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add Event
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* table of event management */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={searchEventFilter}
          selectedValue="blogId"
          columnWidths={{
            blogId: "w-1/12",
            blogName: "w-3/12",
            description: "w-3/12",
            startDate: "w-2/12",
            endDate: "w-2/12",
          }}
        />
      </div>
    </>
  );
}
