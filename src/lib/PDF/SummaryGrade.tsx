"use client";

import jsPDF from "jspdf";
import THSarabunFont from "../Font/THSarabunFont";
import THSarabunFontBold from "../Font/THSarabunBold";
import { GetStudentGradeDetailDto } from "@/dto/gradDto";

const SummaryGradPDF = (grads: GetStudentGradeDetailDto) => {
  const getThaiDate = () => {
    const now = new Date();
    const day = now.getDate();
    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear() + 543; // Convert to Thai Buddhist year

    return `วันที่ ${day} ${month} ${year}`;
  };
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const img = new Image();
  img.src = "/asset/footprintOBAC.png";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const imgWidth = 180;
  const imgHeight = 180;
  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;
  doc.addImage(img, "PNG", x, y, imgWidth, imgHeight);

  const thaiDate = getThaiDate();
  let gender = "";
  if (grads.gender == "Female") {
    gender = "นางสาว";
  } else {
    gender = "นาย";
  }

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
  doc.text(`${gender} ${grads?.thaiName} ${grads?.thaiLastName}`, 130, 30);

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

  doc.line(5, 50, 205, 50);
  doc.line(5, 50, 5, 257);
  doc.line(205, 50, 205, 257);
  doc.line(5, 60, 205, 60);
  doc.line(5, 257, 205, 257);

  doc.setFontSize(12);
  doc.text("รหัสวิชา", 10, 56);
  doc.line(25, 50, 25, 257);
  doc.text("ชื่อวิชา", 48, 56);
  doc.line(83, 50, 83, 257);

  doc.text("หน่วย", 83.5, 54);
  doc.text("กิต", 85, 58);
  doc.line(90, 50, 90, 257);
  doc.text("ผล", 92, 52.5);
  doc.text("การ", 91, 55.5);
  doc.text("เรียน", 90.5, 59);
  doc.line(97, 50, 97, 257);
  doc.text("X", 100, 56);
  doc.line(105, 50, 105, 257);

  doc.text("รหัสวิชา", 110, 56);
  doc.line(125, 50, 125, 257);
  doc.text("ชื่อวิชา", 148, 56);
  doc.line(183, 50, 183, 257);

  doc.text("หน่วย", 183.5, 54);
  doc.text("กิต", 185, 58);
  doc.line(190, 50, 190, 257);
  doc.text("ผล", 192, 52.5);
  doc.text("การ", 191, 55.5);
  doc.text("เรียน", 190.5, 59);
  doc.line(197, 50, 197, 257);
  doc.text("X", 200, 56);
  doc.line(205, 50, 205, 257);

  let startColumn = 65;
  let Xaxis = 30;
  let swift = false;

  let AllOfGrad = 0;
  let AllOfCredit = 0;
  for (let i = 0; i < grads.year.length; i++) {
    if (swift == false && startColumn >= 250) {
      startColumn = 64;
      Xaxis = 130;
      swift = true;
    } else if (swift == true && startColumn > 250) {
      doc.addPage();
      Xaxis = 30;
      swift = false;
    }
    doc.setFont("THSarabunBold", "bold");
    doc.text(
      `ภาคเรียนที่ ${grads.year[i].term} ปีการศึกษา ${grads.year[i].year}`,
      Xaxis + 7,
      startColumn
    );

    doc.setFont("THSarabun", "normal");
    let inStartColoume = startColumn + 4;
    let CreditCount = 0;
    let CountGrad = 0;

    for (let j = 0; j < grads.year[i].termQuery.length; j++) {
      if (swift == false && inStartColoume >= 250) {
        inStartColoume = 63;
        inStartColoume = inStartColoume + 5;
        Xaxis = 130;
        swift = true;
      } else if (swift == true && inStartColoume > 250) {
        doc.addPage();
        inStartColoume = 20;
        Xaxis = 30;
        swift = false;
      }
      let GradResult =
        Number(grads.year[i].termQuery[j].finalGrade) *
        Number(grads.year[i].termQuery[j].credit);
      CountGrad += GradResult;
      CreditCount += Number(grads.year[i].termQuery[j].credit);

      AllOfGrad += GradResult;
      AllOfCredit += Number(grads.year[i].termQuery[j].credit);
      doc.text(
        `${grads.year[i].termQuery[j].subject_code}`,
        Xaxis - 23,
        inStartColoume
      );
      doc.text(
        `${grads.year[i].termQuery[j].subject_name}`,
        Xaxis - 4,
        inStartColoume
      );
      doc.text(
        `${grads.year[i].termQuery[j].credit}`,
        Xaxis + 56,
        inStartColoume
      );
      doc.text(
        `${
          grads.year[i].termQuery[j].remark ||
          grads.year[i].termQuery[j].finalGrade ||
          0
        }`,
        Xaxis + 62,
        inStartColoume
      );
      doc.text(`${GradResult}`, Xaxis + 69, inStartColoume);
      inStartColoume += 5;
      startColumn = inStartColoume + 2;
    }
    doc.setFont("THSarabunBold", "bold");
    doc.text(`รวมหน่วยกิตทั้งหมด ${CreditCount}`, Xaxis - 4, startColumn - 2);
    doc.text(
      `เกรดเฉลี่ย ${(
        CountGrad / parseFloat(CreditCount.toFixed(2)) || 0
      ).toFixed(2)}`,
      Xaxis - 4,
      startColumn + 2
    );
    doc.setFont("THSarabun", "normal");
    startColumn += 8;
  }
  doc.setFont("THSarabunBold", "bold");
  const result = (
    Math.floor((AllOfGrad / parseFloat(AllOfCredit.toFixed(2)) || 0) * 100) /
    100
  ).toFixed(2);
  doc.text(`เกรดเฉลี่ยสะสมทั้งหมด : ${result}`, Xaxis - 4, startColumn);
  doc.setFont("THSarabun", "normal");

  doc.text(`ลงชื่อ .................................................. ( เจ้าหน้าที่งานทะเบียน )`, 25, 265);
  doc.text("( นายพิเชษฐ รอดคุ้ม )",37, 270);

  doc.text(`ลงชื่อ .................................................. ( อาจารย์ที่ปรึกษา )`, 120, 265);
  doc.text("( .................................................. )", 125, 270);

  doc.text(`ลงชื่อ .................................................. ( รอง ผอ.ฝ่ายวิชาการ )`, 25, 280);
  doc.text("( นายรัฐสยาม วงษ์ยี่ )", 37, 285);

  doc.text(`ลงชื่อ .................................................. ( ผู้อำนวยการ )`, 120, 280);
  doc.text("( นายวิทวัต โยธินนรธรรม )", 130, 285);



  doc.text(`${thaiDate}`, 180, 295);

  doc.save(`${grads.studentCode} ${grads.thaiName} ${grads.thaiLastName}.pdf`);
};

export default SummaryGradPDF;
