"use client";

import { GetEventManagementById } from "@/dto/eventDto";
import { useEffect, useState } from "react";
import Image from "next/image";

export function GetEventsById() {
  const [event, setEvent] = useState<GetEventManagementById[]>([]);

  useEffect(() => {}, []);
  return (
    <>
      {/* topic */}
      <div className="mt-20 flex flex-col gap-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold font-poppins">Topic</h1>
          <div className="flex gap-4">
            <span className="text-gray-500 font-poppins">Date :</span>
            <span className="text-gray-700 font-poppins">12/12/2021</span>
          </div>
        </div>

        {/* image */}
        <div className="h-3/4 flex justify-center items-center p-4">
          <Image
            src="/images/event.jpg"
            alt="topic"
            width={800}
            height={600}
            className="transition-transform duration-300 rounded-t-md group-hover:scale-110"
          />
        </div>

        {/* description */}
        <div className="p-4">
          <p className="text-gray-600 font-poppins text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

        <div className="flex justify-end ">author</div>
      </div>
    </>
  );
}
