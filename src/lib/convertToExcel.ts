import {
  GeneralData,
  StudentList,
} from "@/app/(dashboard)/academic/score-management/classroom/[...params]/page";
import {
  convertGradBySubjectId,
  ConvertClassroomToExcelDto,
} from "@/dto/gradDto";
import { StudentListByGroupIDDto } from "@/dto/studentDto";
import ExcelJS from "exceljs";

export async function ConvertScoreToExcel(
  data: convertGradBySubjectId[],
  term: string,
  year: string,
  subjectCode: string,
  subjectName: string,
  classroom: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Grades");

  worksheet.mergeCells("A1:H1");
  const header1 = worksheet.getCell("A1");
  header1.value = `ภาคเรียนที่ ${term} ปีการศึกษา ${year}`;
  header1.alignment = { horizontal: "center", vertical: "middle" };
  header1.font = { size: 14, bold: true };
  worksheet.getRow(1).height = 20;

  worksheet.mergeCells("A2:H2");
  const header2 = worksheet.getCell("A2");
  header2.value = `รหัสวิชา ${subjectCode} : ${subjectName}`;
  header2.alignment = { horizontal: "center", vertical: "middle" };
  header2.font = { size: 12, bold: true };
  worksheet.getRow(2).height = 18;

  const headerRow = worksheet.addRow([
    "ลำดับ",
    "รหัสนักเรียน",
    "ชื่อ-นามสกุล",
    "ห้องเรียน",
    "คะแนนจิตพิสัย (20)",
    "คะแนนเก็บ (50)",
    "คะแนนสอบ (30)",
    "คะแนนรวม",
  ]);

  // Style the header row
  headerRow.eachCell((cell) => {
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true, size: 10 };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  worksheet.getRow(headerRow.number).height = 15;

  worksheet.columns = [
    { key: "index", width: 8 },
    { key: "studentCode", width: 15 },
    { key: "name", width: 25 },
    { key: "classroom", width: 10 },
    { key: "affectiveScore", width: 15 },
    { key: "collectScore", width: 15 },
    { key: "testScore", width: 15 },
    { key: "totalScore", width: 15 },
  ];

  data.forEach((item, index) => {
    const row = worksheet.addRow([
      index + 1, // ลำดับ
      item.studentCode, // รหัสนักเรียน
      item.name, // ชื่อ-นามสกุล
      classroom, // ห้องเรียน
      item.affectiveScore, // คะแนนจิตพิสัย (20)
      item.collectScore, // คะแนนเก็บ (50)
      item.testScore, // คะแนนสอบ (30)
      item.totalScore, // คะแนนรวม
    ]);
    row.eachCell((cell) => {
      cell.font = { size: 10 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row.height = 15;
  });

  // Save the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const filename = `ห้องเรียน ${classroom} Grade.xlsx`;

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function ConvertClassroomToExcel(
  data: StudentListByGroupIDDto[],
  classroom: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Student List");
  worksheet.mergeCells("A1:E1");
  const header1 = worksheet.getCell("A1");
  header1.value = `รายชื่อนักเรียน ห้องเรียน ${classroom}`;
  header1.alignment = { horizontal: "center", vertical: "middle" };
  header1.font = { size: 14, bold: true };
  worksheet.getRow(1).height = 20;

  const headerRow = worksheet.addRow([
    "ลำดับ",
    "รหัสนักศึกษา",
    "ชื่อ - นามสกุล",
    "",
    "หมายเหตุ",
  ]);

  headerRow.eachCell((cell) => {
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true, size: 12 };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  worksheet.getRow(headerRow.number).height = 18;

  worksheet.columns = [
    { key: "index", width: 8 },
    { key: "studentId", width: 15 },
    { key: "name", width: 25 },
    { key: "space", width: 60 },
    { key: "note", width: 20 },
  ];

  data.forEach((student, index) => {
    let gender = student.gender === "Female" ? "นางสาว" : "นาย";
    const row = worksheet.addRow([
      index + 1,
      student.studentCode,
      `${gender} ${student.firstName} ${student.lastName}`,
      "",
      "",
    ]);

    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        horizontal: colNumber === 3 ? "left" : "center",
        vertical: "middle",
      };
      cell.font = { size: 10 };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row.height = 15;
  });

  // Save the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const filename = `รายชื่อนักเรียน ห้องเรียน ${classroom}.xlsx`;

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function ConvertClassroomToExcelWithSubject(
  data: ConvertClassroomToExcelDto[],
  subjectCode: string,
  subjectName: string,
  classroom: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Student List");

  worksheet.mergeCells("A1:E1");
  const header1 = worksheet.getCell("A1");
  header1.value = `รายชื่อนักเรียน กลุ่มเรียน ${classroom} รหัสวิชา ${subjectCode} วิชา ${subjectName}`;
  header1.alignment = { horizontal: "center", vertical: "middle" };
  header1.font = { size: 14, bold: true };
  worksheet.getRow(1).height = 20;

  const headerRow = worksheet.addRow([
    "ลำดับ",
    "รหัสนักศึกษา",
    "ชื่อ - นามสกุล",
    "",
    "หมายเหตุ",
  ]);

  headerRow.eachCell((cell) => {
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true, size: 12 };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  worksheet.getRow(headerRow.number).height = 18;

  worksheet.columns = [
    { key: "index", width: 8 },
    { key: "studentId", width: 15 },
    { key: "name", width: 25 },
    { key: "space", width: 60 },
    { key: "note", width: 20 },
  ];

  // Populate data
  data.forEach((student, index) => {
    const row = worksheet.addRow([
      index + 1,
      student.studentCode,
      `${student.name}`,
      "",
      "",
    ]);

    row.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { size: 10 };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row.height = 15;
  });

  // Save the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const filename = `รายชื่อนักเรียน ห้องเรียน ${classroom}.xlsx`;

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function ConvertClassroomGradingToExcel(
  generalData: GeneralData,
  studentList: StudentList[]
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Grading Sheet");

  worksheet.mergeCells("A1:G1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `วันที่พิมพ์: ${new Date().toLocaleDateString()} วิทยาลัยอาชีวศึกษาเอกวิทย์บริหารธุรกิจ`;
  titleCell.alignment = { horizontal: "center" };
  titleCell.font = { size: 14, bold: true };

  worksheet.mergeCells("A2:G2");
  const classCell = worksheet.getCell("A2");
  classCell.value = `สรุปเกรดนักศึกษา ภาคเรียนที่ ${generalData.term} ปีการศึกษา ห้อง: ${generalData.class}.${generalData.groupName}`;
  classCell.alignment = { horizontal: "center" };
  classCell.font = { size: 12, bold: true };

  const uniqueSubjects = Array.from(
    new Set(studentList.flatMap((student) => Object.keys(student.subjects)))
  );

  // const headerRow = worksheet.addRow([
  //   "ลำดับ",
  //   "รหัสนักศึกษา",
  //   "ชื่อ - นามสกุล",
  //   "ชื่อวิชา", // have like a subjects.length
  //   "เฉลี่ย",
  //   "เฉลี่ยสะสม",
  // ]);

  const headerRowValues = [
    "ลำดับ",
    "รหัสนักศึกษา",
    "ชื่อ - นามสกุล",
    ...uniqueSubjects, 
    "เฉลี่ย",
    "เฉลี่ยสะสม",
  ];
  const headerRow = worksheet.addRow(headerRowValues);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  worksheet.columns = [
    { key: "index", width: 8 },
    { key: "studentCode", width: 15 },
    { key: "name", width: 25 },
    ...uniqueSubjects.map(() => ({ width: 20 })), // Set all subject columns to same width
    { key: "gpa", width: 12 },
    { key: "gpax", width: 12 },
  ];

  studentList.forEach((student, index) => {
    const rowData = [
      index + 1,
      student.studentCode,
      student.name,
      ...uniqueSubjects.map((subject) => student.subjects[subject] || "-"), // Show "-" if subject doesn't exist
      student.gpa.toFixed(2),
      student.gpax.toFixed(2),
    ];

    const row = worksheet.addRow(rowData);

    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 3 ? "left" : "center",
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ออกคะแนนห้อง ${generalData.class}${generalData.groupName}.xlsx`;
  link.click();
}
