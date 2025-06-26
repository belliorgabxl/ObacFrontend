"use client";

import CardSubject from "@/components/common/Card/card-subject";
import React, { useEffect, useState } from "react";
import { TeacherEnrollment } from "@/dto/teacherDto";
import {
  fetchGetTeacherEnrollmentsByTeacherId,
  fetchTeacherUser,
} from "@/api/oldApi/teacher/teacherAPI";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Props = {
  teacherId: number;
};

const getSubjectData = async (
  teacherId: number,
  term: string,
  year: number
) => {
  try {
    const data = fetchGetTeacherEnrollmentsByTeacherId(teacherId, term, year);
    return data;
  } catch (err) {
    console.error("Failed to fetch teacher enroll :", err);
  }
};

export default function Form({ teacherId }: Props) {
  const currentYear = new Date().getFullYear() + 542;
  const [subjectCards, setCard] = useState<TeacherEnrollment[]>();
  const [year, setYear] = useState<number>(2567);
  const [term, setTerm] = useState<string>("2");
  const [isLoadingCard  , setIsLoadingCard] = useState<boolean>(false);
  const thaiDaysOrder = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์"
  ];
  const sortedSubjectCards = subjectCards
  ? [...subjectCards].sort((a, b) => {
      return thaiDaysOrder.indexOf(a.day) - thaiDaysOrder.indexOf(b.day);
    })
  : [];
  useEffect(() => {
    getSubjectData(teacherId, term, year).then((item) => {
      setCard(item);
      setIsLoadingCard(true)
    });
  }, []);

  useEffect(() => {
    setCard([]);
    getSubjectData(teacherId, term, year).then((item) => {
      setCard(item);
    });
  }, [term, year]);

  return (
    <>
      <div className="text-xl px-10 ">
        <div>
          <div className="flex gap-5  px-5 py-1 ">
            <div className="flex items-center gap-2">
              {/* {teacherId} */}
              <p>เทอม</p>
              <select
                className="px-4 py-1 border border-gray-300 rounded-sm focus:outline-blue-400"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ">
              <p>ปีการศึกษา</p>
              <select
                className="px-4 py-1 border border-gray-300 rounded-sm focus:outline-blue-400"
                onChange={(e) => setYear(Number(e.target.value))}
                value={year}
              >
                <option value={2567}>2567</option>
                <option value={2566}>2566</option>
                <option value={2565}>2565</option>
              </select>
            </div>
          </div>
        </div>
        {isLoadingCard ? (
          <div className="border-2 py-2 px-5 grid place-items-center border-gray-200 border-dashed">
          {sortedSubjectCards && sortedSubjectCards.length > 0 ? (
            <div className="lg:w-9/12 sm:w-full md:w-full">
              {sortedSubjectCards.map((items) => {
                const adjustedTerm = Number(items.term) % 2 === 1 ? 1 : 2;
                return (
                  <Link
                    key={items.id}
                    href={`/teacher/subject/subjectScore?subject=${items.subjectId}&group=${items.studentGroupId}&iscomplete=${items.isComplete}&term=${items.term}&year=${items.year}&class=${items.studentClass}`}
                  >
                    <CardSubject
                      cardSubjectData={items}
                      term={adjustedTerm.toString()}
                      year={items.year}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid text-gray-500 text-3xl font-semibold place-items-center py-10">
              ไม่มีวิชาที่สอน
            </div>
          )}
        </div>
        ):(
          <div className="border-2 border-dashed border-blue-200 rounded-md grid place-items-center py-10 ">
            <p className="gap-5 flex items-center text-3xl text-blue-500"><Loader2 className="h-10 w-10 animate-spin"/> Loading</p>
          </div>
        )}
        
      </div>
    </>
  );
}
