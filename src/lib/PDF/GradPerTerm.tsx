"use client";

import jsPDF from "jspdf";
import THSarabunFont from "../Font/THSarabunFont";
import THSarabunFontBold from "../Font/THSarabunBold";
import { GetGradPerTermByStudentIdDto } from "@/dto/gradDto";

const GradPerTerms = (grads: GetGradPerTermByStudentIdDto) => {
  const now = new Date();
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const formattedDate = now.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  doc.addFileToVFS("THSarabun.ttf", THSarabunFont);
  doc.addFileToVFS("THSarabunBold.ttf", THSarabunFontBold);

  doc.addFont("THSarabun.ttf", "THSarabun", "normal");
  doc.addFont("THSarabunBold.ttf", "THSarabunBold", "bold");

  // ================================

  doc.setFont("THSarabunBold");
  doc.setFont("THSarabunBold", "bold");
  doc.setFontSize(18);
  doc.text("วิทยาลัยอาชีวศึกษาเอกวิทย์บริหารธุรกิจ", 75, 10);
  doc.setFontSize(16);

  doc.setFont("THSarabun", "normal");
  doc.text(
    "5 ซ.ลาดกระบัง 34/1 ถ.ลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพมหานคร",
    40,
    15
  );

  doc.setFont("THSarabunBold");
  doc.setFont("THSarabunBold", "bold");
  doc.text("รายงานผลการศึกษา", 90, 24);

  doc.setFontSize(14);
  doc.text(`รหัสนักศึกษา : ${grads?.studentCode}`, 30, 30);
  doc.text("ชื่อ - สกุล   : ", 110.5, 30);
  doc.text(`นาย ${grads?.firstName} ${grads?.lastName}`, 130, 30);

  doc.setFont("THSarabun", "normal");
  doc.text("รอบ : เช้า", 42, 35);
  doc.text("ประเภทวิชา : ", 110.5, 35);
  doc.text(`${grads.facultyName}`, 130, 35);

  doc.text(`ชั้นปี : ${grads.class}.${grads.groupName}`, 42, 40);
  doc.text("สาขาวิชา     : ", 110, 40);
  doc.text(`${grads.programName}`, 130, 40);

  doc.text("สถานะนักเรียน : กำลังศึกษา", 28.5, 45);
  doc.text("สาขางาน     : ", 110, 45);
  doc.text(`${grads.programName}`, 130, 45);

  doc.line(5, 50, 204, 50);
  doc.line(5, 60, 204, 60);

  doc.setFont("THSarabunBold", "bold");
  doc.text("รหัสวิชา", 15, 56.5);
  doc.text("ชื่อวิชา", 65, 56.5);
  doc.text("หน่วยกิต", 125, 56.5);
  doc.text("เกรด", 165, 56.5);

  doc.text(`ปีการศึกษา ${grads.term}/${grads.year}`, 45, 65);

  doc.setFont("THSarabun", "normal");

  let startRows = 70;

  for (let i = 0; i < grads.subject.length; i++) {
    doc.text(`${grads.subject[i].subjectCode}`, 11, startRows);
    startRows += 7;
  }

  startRows = 70;
  for (let i = 0; i < grads.subject.length; i++) {
    doc.text(`${grads.subject[i].subjectName}`, 45, startRows);
    startRows += 7;
  }
  startRows = 70;
  for (let i = 0; i < grads.subject.length; i++) {
    doc.text(`0-${grads.subject[i].credit}-0`, 127, startRows);
    startRows += 7;
  }
  startRows = 70;
  for (let i = 0; i < grads.subject.length; i++) {
    doc.text(`${grads.subject[i].grade || "ผ"}`, 165, startRows);
    startRows += 7;
  }
  doc.text(`หน่วยกิตประจำภาค : ${grads.totalCredit}`, 50, 135);
  doc.text(`หน่วยกิตสะสม : ${grads.totalCredit}`, 57, 142);

  doc.text(`ผลการเรียนเฉลี่ยประจำภาค : ${grads.gpa.toFixed(2)}`, 120, 135);
  doc.text(`ผลการเรียนเฉลี่ยสะสม : ${grads.gpax.toFixed(2)}`, 127, 142);

  doc.setLineWidth(0.3);
  doc.line(5, 280, 205, 280);

  doc.text("น.ส.พรทิพย์ จำนิพันธ์", 5, 286);
  doc.text("1/1 นายทะเบียน นางสาวพันทิพย์ จำนิพันธ์", 85, 286);
  doc.text(`${formattedDate} - ${formattedTime}`, 172, 286);

  doc.save(`${grads.studentCode}.pdf`);
};

export default GradPerTerms;
