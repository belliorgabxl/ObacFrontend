import {
  fetchAddSubject,
  fetchDeleteSubject,
  fetchGetAllSubject,
  fetchUpdateSubject,
} from "@/api/oldApi/subject/subjectAPI";
import { LibraryBig, Pencil, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetAllSubject } from "@/dto/subjectDto";
import { fetchGetAllProgram } from "@/api/oldApi/program/programAPI";
import { GetAllProgram } from "@/dto/programDto";
import Select from "react-select";

const getAllSubject = async () => {
  try {
    const data = await fetchGetAllSubject();
    return data;
  } catch (err) {
    return [];
  }
};

export default function Form() {
  const [addSubjectCode, setAddSubjectCode] = useState<string | null>(null);
  const [addSubjectName, setAddSubjectName] = useState<string | null>(null);
  const [addProgramId, setAddProgramId] = useState<number | null>(null);
  const [addTerm, setAddTerm] = useState<string | null>(null);
  const [addCredits, setCredits] = useState<number>(0);
  const [addIsActive, setIsActive] = useState<boolean>(false);

  const [editSubjectCode, setEditSubjectCode] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState<string | null>(null);
  const [editCreditSubject, setEditCredisSubject] = useState<number>(0);
  const [editSubjectStatus, setEditSubjectStatus] = useState<boolean>(false);
  const [subjects, setSubject] = useState<GetAllSubject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getAllSubject().then((d) => {
      setSubject(d);
    });
  }, []);

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [getEditSubjectId, setGetEditIdSubject] = useState<number>(0);
  const [getEditSubjectCode, setGetEditSubjectCode] = useState<string>("");
  const [getEditSubjectName, setGetEditSubjectName] = useState<string>("");

  const [addSubject_popup, setAddSubjectPopUp] = useState<boolean>(false);
  const [editSubject_popup, setEditSubjectPopUp] = useState<boolean>(false);
  const [triggerAddSubject, setTriggerAddSubject] = useState<boolean>(false);

  const [triggerEditSubject, setTriggerEditSubject] = useState<boolean>(false);

  const getAddSubjectProps = (
    subjectName: string,
    subjectCode: string,
    term: string,
    programId: number,
    credits: number,
    isActive: boolean
  ) => {
    setAddSubjectName(subjectName);
    setAddSubjectCode(subjectCode);
    setAddProgramId(programId);
    setAddTerm(term);
    setCredits(credits);
    setIsActive(isActive);
    // console.log("get", {
    //   subjectName,
    //   subjectCode,
    //   term,
    //   programId,
    //   credits,
    //   isActive,
    // });
    setTriggerAddSubject(true);
  };
  const AddSubject = async () => {
    try {
      if (addSubjectCode && addSubjectName && addTerm && addProgramId) {
        const response = await fetchAddSubject(
          addSubjectCode,
          addSubjectName,
          addCredits,
          addTerm,
          addProgramId,
          addIsActive
        );
        if (response) {
          toast.success("เพิ่มวิชาสำเร็จ");
          window.location.reload();
        } else {
          toast.error("เพิ่มวิชาไม่สำเร็จ");
        }
      }
    } catch (err) {
      toast.error("เพิ่มวิชาไม่สำเร็จ");
    }
    // console.log("api", {
    //   addSubjectCode,
    //   addSubjectName,
    //   addTerm,
    //   addProgramId,
    //   addCredits,
    //   addIsActive,
    // });
  };
  useEffect(() => {
    if (triggerAddSubject) {
      AddSubject();
    }
    setTriggerAddSubject(false);
  }, [triggerAddSubject]);

  const getEditSubjectProps = (
    id: number,
    subjectName: string,
    subjectCode: string,
    subjectCredits: number,
    getIsActive: boolean
  ) => {
    setGetEditIdSubject(id);
    setEditSubjectName(subjectName);
    setEditSubjectCode(subjectCode);
    setEditCredisSubject(subjectCredits);
    setEditSubjectStatus(getIsActive);
    setTriggerEditSubject(true);
  };
  const EditSubject = async () => {
    try {
      if (editSubjectCode && editSubjectName) {
        const isUpdated = await fetchUpdateSubject(
          getEditSubjectId,
          editSubjectCode,
          editSubjectName,
          editCreditSubject,
          editSubjectStatus
        );
        if (isUpdated) {
          toast.success("แก้ไขวิชาสำเร็จ");
          setTimeout(() => {
            1000;
          });
          window.location.reload();
        } else {
          toast.error("แก้ไขไม่สำเร็จ");
        }
      }
    } catch (err) {
      toast.error("ผิดพลาด");
    }
  };

  useEffect(() => {
    if (triggerEditSubject) {
      EditSubject();
    }
    setTriggerEditSubject(false);
  }, [triggerEditSubject]);

  const getAndDelete = async (id: number) => {
    const isDeleted = await fetchDeleteSubject(id);

    if (isDeleted) {
      toast.success("ลบสำเร็จ");
      getAllSubject().then((d) => setSubject(d));
    } else {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="w-full">
      <div className="flex py-3 px-10 justify-start">
        <h1 className="px-8 py-2 rounded-3xl flex gap-2 items-center text-xl w-fit border border-gray-100  shadow-md text-blue-700">
          <LibraryBig className="h-8 w-8" />
          ระบบจัดการรายวิชา
        </h1>
      </div>
      <div className="px-10 py-2 flex justify-between gap-5">
        <input
          type="text"
          placeholder="ค้นหาวิชา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 px-4 py-1 rounded-md"
        />
        <button
          className="px-10 py-1 flex text-lg gap-2 h-fit items-center bg-blue-500 hover:bg-blue-600 text-white rounded-3xl"
          onClick={() => setAddSubjectPopUp(true)}
        >
          <PlusCircle className="w-5 h-5 text-white  " />
          เพิ่มวิชาและหลักสูตร
        </button>
      </div>
      <div className="w-full rounded-sm px-10">
        <div className="w-full shadow-lg grid grid-cols-[5%_20%_35%_10%_15%_15%] bg-white text-blue-950 text-lg  border-t-2 border-b-2 border-gray-400 ">
          <div className="text-center    py-2 text-black">ลำดับ</div>
          <div className="text-center    py-2">รหัสวิชา</div>
          <div className="text-center   py-2">ชื่อวิชา</div>
          <div className="text-center  py-2">หน่วยกิต</div>
          <div className="text-center   py-2">สถานะ</div>
          <div className="text-center py-2">Action</div>
        </div>
        {subjects.length > 0 ? (
          <div className="shadow-md">
            {filteredSubjects?.map((item: GetAllSubject, index) => (
              <div
                key={item.id}
                className={` ${
                  index % 2 == 0 ? "bg-white" : "bg-white"
                } grid grid-cols-[5%_20%_35%_10%_15%_15%]  hover:bg-blue-100 border border-gray-300  border-t-0`}
              >
                <div className="text-center flex items-center w-full justify-center text-black border-r py-1  border-gray-300">
                  {index + 1}.
                </div>
                <div className="text-start flex items-center text-gray-700 py-1 px-4 border-r border-gray-300">
                  <p className="line-clamp-1">{item.subjectCode}</p>
                </div>
                <div className="text-start flex items-center text-gray-700 py-1 px-4 border-r  border-gray-300">
                  <p className="line-clamp-1">{item.subjectName}</p>
                </div>
                <div className="text-center flex items-center text-gray-700 py-1 px-4 border-r  border-gray-300">
                  <p className="line-clamp-1">{item.credits}</p>
                </div>
                <div className="text-center flex items-center w-full justify-center py-1 border-r border-gray-300">
                  {item.isActive ? (
                    <p className="text-green-500 font-thin line-clamp-1 lg:text-[16px] text-[14px]">
                      ใช้งาน
                    </p>
                  ) : (
                    <p className="text-red-500 font-thin lg:text-[16px] line-clamp-1 text-[14px]]">
                      ไม่ใช้งาน
                    </p>
                  )}
                </div>
                <div className=" flex items-center justify-center gap-2 py-1">
                  <button
                    className="w-fit px-2 flex justify-center py-1 text-sm rounded-full hover:bg-gray-400 text-gray-400 hover:text-white  bg-white-400  shadow-md duration-500  bg-white"
                    onClick={() => {
                      setEditSubjectPopUp(true);
                      setGetEditIdSubject(item.id);
                      setGetEditSubjectCode(item.subjectCode);
                      setGetEditSubjectName(item.subjectName);
                      setEditCredisSubject(item.credits);
                      setEditSubjectStatus(item.isActive);
                    }}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full border-2 border-t-0 border-dashed border-gray-300 grid place-items-center rounded-md  py-10 ">
            <p className="text-2xl  text-gray-600">ไม่มีข้อมูล</p>
          </div>
        )}
      </div>

      {addSubject_popup && (
        <AddSubjectPopUp
          onClosePopUp={setAddSubjectPopUp}
          onSave={getAddSubjectProps}
        />
      )}
      {editSubject_popup && (
        <EditSubjectPopUp
          onClosePopUp={setEditSubjectPopUp}
          onSave={getEditSubjectProps}
          onDelete={getAndDelete}
          ID={getEditSubjectId}
          SubjectCode={getEditSubjectCode}
          SubjectName={getEditSubjectName}
          SubjectCredits={editCreditSubject}
          isActive={editSubjectStatus}
        />
      )}
    </div>
  );
}

type AddPopUpProps = {
  onClosePopUp: (value: boolean) => void;
  onSave: (
    name: string,
    id: string,
    term: string,
    programID: number,
    credits: number,
    isActive: boolean
  ) => void;
};

const AddSubjectPopUp = ({ onClosePopUp, onSave }: AddPopUpProps) => {
  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [programID, setProgramID] = useState<number | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isActive, setActive] = useState<boolean>(false);
  const [programs, setPrograms] = useState<GetAllProgram[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetchGetAllProgram().then((item: GetAllProgram[]) => {
      setPrograms(item);
    });
  }, []);
  const Save = () => {
    if (subjectName && subjectCode && programID) {
      onSave(subjectName, subjectCode, term, programID, credits, isActive);
      onClosePopUp(false);
    }
  };

  const programOptions = programs.map((item) => ({
    value: item.programId,
    label: `${item.facultyName}`,
  }));
  const handleProgramChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setProgramID(selectedOption ? selectedOption.value : null);
    setChecked(false);
  };
  return (
    <div
      className="fixed duration-1000 animate-appearance inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
      onClick={() => onClosePopUp(false)}
    >
      <div
        className="bg-white rounded-md   lg:w-[500px]  z-100 shadow-lg shadow-gray-500 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-center rounded-t-md text-center text-xl  bg-white">
          <p className="py-2 text-xl font-semibold text-gray-800">
            เพิ่มวิชาเรียน
          </p>
        </div>
        <div className="w-full px-10 py-5 grid place-items-start gap-4">
          <div className="flex items-center gap-2">
            <label>รหัสวิชา : </label>
            <input
              placeholder="กรอกรหัสวิชา"
              className="w-[200px] px-5 py-1 border border-gray-200 rounded-sm"
              onChange={(e) => setSubjectCode(e.target.value)}
              value={subjectCode}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>ชื่อวิชา : </label>
            <input
              placeholder="กรอกชื่อวิชา"
              className="w-[200px] px-5 py-1 border border-gray-200 rounded-sm"
              onChange={(e) => setSubjectName(e.target.value)}
              value={subjectName}
            />
          </div>
        </div>
        <div className="flex items-center justify-start px-10 gap-3">
          <div className="flex items-center gap-2 ">
            <label>หน่วยกิต :</label>
            <input
              type="number"
              className="w-[50px] border rounded-sm px-2"
              onChange={(e) => setCredits(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>ภาคเรียน :</label>
            <select
              className=" px-2 py-1 border border-gray-300 rounded-sm"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            >
              <option value="">เลือก</option>
              <option value="1">ปี 1 เทอม 1</option>
              <option value="2">ปี 1 เทอม 2</option>
              <option value="3">ปี 2 เทอม 1</option>
              <option value="4">ปี 2 เทอม 2</option>
              <option value="5">ปี 3 เทอม 1</option>
              <option value="6">ปี 3 เทอม 2</option>
            </select>
          </div>
        </div>
        <div className="w-full px-10 py-5 grid place-items-start gap-8">
          <div className="flex items-center gap-2">
            <label>สถานะใช้งาน :</label>
            <button
              onClick={() => setActive(!isActive)}
              className={`relative w-[46px] h-6 flex items-center rounded-full py-1 px-1transition-all duration-300 ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  isActive ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="w-full px-10 py-2 flex justify-start items-center gap-8">
          <Select
            options={programOptions}
            value={
              programOptions.find((option) => option.value === programID) ||
              null
            }
            onChange={handleProgramChange}
            isSearchable
            className="w-full"
            placeholder="หลักสูตร"
          />
          <div className="flex items-center w-full gap-2">
            <input
              type="checkbox"
              id="checkbox"
              checked={checked}
              onChange={() => {
                setProgramID(99);
                setChecked(!checked);
              }}
              className="w-5 h-5 accent-blue-500"
            />
            <label>ทุกหลักสูตร</label>
          </div>
        </div>
        <div className="py-5 w-full flex gap-5 justify-center">
          <button
            className="px-5 w-[90px] bg-gray-300 text-black py-1 rounded-sm  hover:bg-gray-500"
            onClick={() => onClosePopUp(false)}
          >
            ยกเลิก
          </button>{" "}
          <button
            className="px-5 w-[90px] bg-blue-500 text-white py-1 rounded-sm  hover:bg-blue-700"
            onClick={() => Save()}
          >
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
};

type EditPopUpProps = {
  onClosePopUp: (value: boolean) => void;
  onSave: (
    id: number,
    name: string,
    code: string,
    credits: number,
    isActive: boolean
  ) => void;
  onDelete: (Id: number) => void;
  ID: number;
  SubjectName: string;
  SubjectCode: string;
  SubjectCredits: number;
  isActive: boolean;
};

const EditSubjectPopUp = ({
  onClosePopUp,
  onSave,
  onDelete,
  ID,
  SubjectName,
  SubjectCode,
  SubjectCredits,
  isActive,
}: EditPopUpProps) => {
  const [subjectName, setSubjectName] = useState<string>(SubjectName);
  const [subjectCode, setSubjectCode] = useState<string>(SubjectCode);
  const [subjectCredits, setSubjectCredits] = useState<number>(SubjectCredits);
  const [editIsActive, setIsActive] = useState<boolean>(isActive);
  const [deleteTrigger, setDeleteTrigger] = useState<boolean>(false);

  const Save = () => {
    if (subjectName && subjectCode) {
      onSave(ID, subjectName, subjectCode, subjectCredits, editIsActive);
      onClosePopUp(false);
    }
  };
  const Delete = () => {
    setDeleteTrigger(true);
  };
  const deleteHandler = () => {
    onDelete(ID);
    setDeleteTrigger(false);
    onClosePopUp(false);
  };
  return (
    <div
      className="fixed duration-1000 animate-appearance inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
      onClick={() => onClosePopUp(false)}
    >
      <div
        className="bg-white rounded-md   lg:w-[500px]  z-100 shadow-lg shadow-gray-500 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-center rounded-t-md text-center text-xl  ">
          <p className="py-4  text-gray-800">แก้ไขวิชาเรียน</p>
        </div>
        <div className="w-full px-10 py-5 grid place-items-center gap-4">
          <div className="flex items-center gap-2">
            <label>รหัสวิชา : </label>
            <input
              className="w-[200px] px-5 py-1 border border-gray-200 rounded-sm"
              onChange={(e) => setSubjectCode(e.target.value)}
              value={subjectCode}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>ชื่อวิชา : </label>
            <input
              className="w-[200px] px-5 py-1 border border-gray-200 rounded-sm"
              onChange={(e) => setSubjectName(e.target.value)}
              value={subjectName}
            />
          </div>
          <div className="flex w-full justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <label>หน่วยกิต : </label>
              <input
                type="number"
                className="w-[60px] px-5 py-1 border border-gray-200 rounded-sm"
                onChange={(e) => setSubjectCredits(Number(e.target.value))}
                value={subjectCredits}
              />
            </div>
            <div className="flex items-center gap-2">
              <label>สถานะ</label>
              <button
                onClick={() => setIsActive(!editIsActive)}
                className={`relative w-[46px] h-6 flex items-center rounded-full py-1 px-1transition-all duration-300 ${
                  editIsActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                    editIsActive ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="py-5 w-full flex gap-5 justify-center">
          <button
            className="px-5 w-[80px] bg-blue-400 text-white py-1 rounded-sm  hover:bg-blue-600"
            onClick={() => Save()}
          >
            บันทึก
          </button>
          <button
            className="px-5 w-[80px] bg-red-400 text-white py-1 rounded-sm  hover:bg-red-600"
            onClick={() => Delete()}
          >
            ลบ
          </button>
          <button
            className="px-5 w-[80px] bg-gray-500 text-white py-1 rounded-sm  hover:bg-gray-700"
            onClick={() => onClosePopUp(false)}
          >
            ยกเลิก
          </button>
        </div>
      </div>
      {deleteTrigger && (
        <div
          className="fixed duration-1000 animate-appearance inset-0 flex items-center justify-center bg-gray-700 bg-opacity-45"
          onClick={() => setDeleteTrigger(false)}
        >
          <div
            className="bg-white rounded-md   lg:w-[300px]  z-100 shadow-lg shadow-gray-500 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <h1 className="py-5 w-full text-center text-xl">ยืนยันการลบ</h1>
              <div className="flex justify-center gap-5 py-5 w-full">
                <button
                  className="px-4 bg-gray-300 rounded-md hover:bg-gray-400 py-1 text-black"
                  onClick={() => setDeleteTrigger(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="px-4 bg-red-500 rounded-md text-white hover:bg-red-600 py-1 "
                  onClick={deleteHandler}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
