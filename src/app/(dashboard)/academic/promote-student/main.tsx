"use client";

import React, { useEffect, useState } from "react";
import SelectTermAndYear from "@/components/Academic/SelectTermYear";
import GroupSelector, { GroupOption } from "@/components/Academic/GroupSelector";
import GradeFilter from "@/components/Academic/GradeFilter";
import StudentListTable from "@/components/Academic/StudentListTable";
import ConfirmPromoteModal from "@/components/Academic/ConfirmPromoteModal";
import { ArrowUpDown } from "lucide-react";
import { toast } from "react-toastify";
import { GetGropGradeAbove } from "@/api/oldApi/grad/gradAPI";
import { fetchPromoteStudentGroup, fetchGetStudentGroupsByTermYear } from "@/api/oldApi/student/studentApi";
import { GetStudentGroupsByTermYearDto } from "@/dto/studentDto";
import { GetGropGradeAboveModel } from "@/dto/gradDto";
import HeaderLabel from "@/components/common/labelText/HeaderLabel";
// import { GetStudentGroupsByTermYearDto, GetGropGradeAboveModel } from "@/dto/gradDto";

export default function Main() {
  const dateTime = new Date();
  const currentMonth = dateTime.getMonth();
  const currentYear = currentMonth > 5 ? dateTime.getFullYear() + 543 : dateTime.getFullYear() + 543 - 1;
  const defaultTerm = currentMonth > 5 ? "1" : "2";

  const [groups, setGroups] = useState<GetStudentGroupsByTermYearDto[]>([]);
  const [groupID, setGroupID] = useState<number>(0);
  const [grads, setGrad] = useState(2);
  const [term, setTerm] = useState<string>(defaultTerm);
  const [year, setYear] = useState<number>(currentYear);
  const [newGroup, setNewGroup] = useState<GetGropGradeAboveModel | null>(null);
  const [nextGroupNameA, setNextGroupNameA] = useState<string>("");
  const [nextGroupNameB, setNextGroupNameB] = useState<string>("");
  const [promoteTrigger, SetPromoteTrigger] = useState<boolean>(false);
  const [confirmPromoteTrigger, setConfirmPromoteTrigger] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await fetchGetStudentGroupsByTermYear(term, year);
        setGroups(data || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
        setGroups([]);
      }
    };
    fetchGroups();
  }, [term, year]);

  const groupOptions: GroupOption[] = groups.map((item) => ({
    value: item.groupId,
    label: `${item.class}.${item.groupName}`,
  }));

  const onFilterGroup = async () => {
    try {
      const result = await GetGropGradeAbove(grads, term, year, groupID);
      setNewGroup(result);
      setIsSearch(true);
    } catch (err) {
      console.error("Failed to filter group", err);
      setIsSearch(false);
    }
  };

  const onPromoteStudentGroup = async () => {
    if (!newGroup) return;
    setConfirmPromoteTrigger(true);

    const nextGroupName = `${nextGroupNameA}/${nextGroupNameB}`;
    const studentIds = newGroup.student.map((s) => Number(s.studentId));

    const randomPrefix = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const randomNumber = Math.floor(100 + Math.random() * 900);

    try {
      const res = await fetchPromoteStudentGroup({
        studentIds,
        groupId: groupID,
        newGroupName: nextGroupName,
        newGroupCode: `${randomPrefix}-${randomNumber}`,
        year,
        term,
      });
      if (res?.ok !== false) {
        toast.success("เลื่อนชั้นเรียนสำเร็จ");
        SetPromoteTrigger(false);
        setNextGroupNameA("");
        setNextGroupNameB("");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("เกิดข้อผิดพลาดในการเลื่อนชั้นเรียน");
      }
    } catch (err) {
      console.error("Promote error", err);
      toast.error("ไม่สามารถเลื่อนชั้นได้");
    } finally {
      setConfirmPromoteTrigger(false);
    }
  };

  return (
    <div className="pl-16 py-5">
      <div className="flex justify-start px-10 mb-6">
       <HeaderLabel title="เลื่อนชั้นนักเรียน" Icon={<ArrowUpDown className="h-8 w-8 "/>}/>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-10 py-5">
        <SelectTermAndYear
          term={term}
          year={year}
          currentYear={currentYear}
          onChangeTerm={setTerm}
          onChangeYear={setYear}
        />
        <GradeFilter grade={grads} onChange={setGrad} />
        <GroupSelector
          groupOptions={groupOptions}
          selectedGroupID={groupID}
          onChange={(groupId) => setGroupID(groupId || 0)}
        />
        <button
          onClick={onFilterGroup}
          disabled={!term || !year || !groupID}
          className="px-5 py-1.5 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
        >
          ค้นหา
        </button>
      </div>

      <div className="px-10">
        {isSearch && newGroup ? (
          <>
            <p className="mb-3 text-gray-600 font-medium">
              ชั้นเรียนปัจจุบัน: <span className="text-blue-800 font-semibold">{newGroup.class}.{newGroup.groupName}</span>
            </p>
            <div className="flex gap-3 items-center mb-4">
              <p className="text-[18px] text-gray-700">ระบุชั้นเรียนต่อไป:</p>
              <p className="px-2 py-1 text-green-500 font-semibold bg-slate-100 rounded-md">{newGroup.class}</p>
              <select className="border px-3 py-1 rounded-md" value={nextGroupNameA} onChange={(e) => setNextGroupNameA(e.target.value)}>
                <option value="">เลือกปี</option>
                {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-xl">/</span>
              <select className="border px-3 py-1 rounded-md" value={nextGroupNameB} onChange={(e) => setNextGroupNameB(e.target.value)}>
                <option value="">เลือกห้อง</option>
                {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
            </div>
            <StudentListTable students={newGroup.student} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => SetPromoteTrigger(true)}
                disabled={!nextGroupNameA || !nextGroupNameB}
                className="px-6 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                เลื่อนชั้นนักเรียน
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-10 text-2xl font-semibold border-2 border-dashed border-gray-300 rounded-md">
            {isSearch ? "ไม่พบข้อมูล" : "ยังไม่ได้เลือก"}
          </div>
        )}
      </div>

      <ConfirmPromoteModal
        open={promoteTrigger}
        currentGroup={`${newGroup?.class}.${newGroup?.groupName}`}
        nextGroup={`${newGroup?.class}.${nextGroupNameA}/${nextGroupNameB}`}
        onCancel={() => SetPromoteTrigger(false)}
        onConfirm={onPromoteStudentGroup}
        isLoading={confirmPromoteTrigger}
      />
    </div>
  );
}
