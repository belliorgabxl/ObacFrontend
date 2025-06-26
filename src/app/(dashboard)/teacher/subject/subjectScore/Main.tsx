"use client";
import { useEffect, useState } from "react";
import MenuBar from "./Menu";
import SubjectTableForm from "./Form";
import {
  GetGradBySubjectId
} from "@/dto/gradDto";
import {
  fetchGetStudentGroupGradeByGroupIdTermYear,
} from "@/api/oldApi/grad/gradAPI";
import { GetScheduleBysubjectId } from "@/dto/schedule";
import { fetchGetSubjectBySubjectId } from "@/api/oldApi/subject/subjectAPI";
import { GetSubjectBySubjectId } from "@/dto/subjectDto";
import { MethodDto } from "@/dto/methodDto";
import { fetchMethod } from "@/api/oldApi/method/methodAPI";

interface Props {
  subjectId: number;
  groupId: number;
  isComplete: string;
  term: string;
  year: number;
  className:string;
}

const getMethodData = async () => {
  try {
    const response = await fetchMethod();
    return response;
  } catch (err) {
    console.log("Fetch error in FE");
  }
};

const getStudentGroupGradData = async (
  groupId: number,
  term: string,
  year: number,
  subjectId: number
) => {
  try {
    const response = await fetchGetStudentGroupGradeByGroupIdTermYear(
      groupId,
      term,
      year,
      subjectId
    );
    return response;
  } catch (err) {
    console.log("fetch API errors");
  }
};

const getSubjectBySubjectId = async (subjectId: number) => {
  try {
    const data = await fetchGetSubjectBySubjectId(subjectId);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default function Main({
  subjectId,
  groupId,
  isComplete,
  term,
  year,
  className,
}: Props) {
  console.log("data : " , {
    subjectId , 
    groupId , 
    isComplete,
    term,
    year
  })
  const [grads, setGrads] = useState<GetGradBySubjectId[]>();
  const [schedules, setSchedules] = useState<GetScheduleBysubjectId[]>();
  const [subjects, setSubjects] = useState<GetSubjectBySubjectId>();
  const [methods, setMethod] = useState<MethodDto>();

  useEffect(() => {
    getStudentGroupGradData(groupId, term, year, subjectId).then((d: any) => {
      setGrads(d);
    });
    getSubjectBySubjectId(subjectId).then((items) => {
      setSubjects(items);
    });
    getMethodData().then((items) => {
      setMethod(items);
    });
  }, []);

  const [edit, setEdit] = useState<boolean | null | undefined>();
  const getEdit = (data: boolean) => {
    setEdit(data);
  };

  return (
    <div className="pl-16">
      {subjects && methods && (
        <MenuBar
          schedules={schedules}
          grads={grads}
          method={methods}
          subjects={subjects}
          isComplete={isComplete}
          className={className}
          onEditReturn={getEdit}
        />
      )}
      <div className="px-0 py-5">
        {grads && <SubjectTableForm grads={grads} onEdit={edit} />}
      </div>
    </div>
  );
}
