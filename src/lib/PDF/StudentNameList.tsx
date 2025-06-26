"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import THSarabunFont from "../Font/THSarabunFont";
import THSarabunFontBold from "../Font/THSarabunBold";
import { StudentListByGroupIDDto } from "@/dto/studentDto";

interface DataList {
  student?: StudentListByGroupIDDto[];
  studentGroup: string;
  year: number;
}

const StudentNameListPDF = ({ student, studentGroup, year }: DataList) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.addFileToVFS("THSarabun.ttf", THSarabunFont);
  doc.addFont("THSarabun.ttf", "THSarabun", "normal");

  doc.addFileToVFS("THSarabunBold.ttf", THSarabunFontBold);
  doc.addFont("THSarabunBold.ttf", "THSarabunBold", "normal");

  doc.setFont("THSarabunBold");
  doc.setFontSize(20);
  doc.text(`วิทยาลัยอาชีวศึกษาเอกวิทย์บริหารธุรกิจ`, 105, 10, {
    align: "center",
  });
  doc.setFont("THSarabun");
  doc.setFontSize(16);
  doc.text(
    `รายชื่อนักศึกษา ห้อง ${studentGroup}     ประจำปีการศึกษา ${year}    แผนก`,
    105,
    18,
    {
      align: "center",
    }
  );
  doc.text(
    `นักศึกษามาสอบ.........คน   ขาดสอบ.........คน    รหัส.......................ชื่อวิชา........................................`,
    105,
    24,
    {
      align: "center",
    }
  );
  doc.setFontSize(12);

  autoTable(doc, {
    startY: 27,
    body: [["ลำดับ", "รหัสนักศึกษา", `   ชื่อ - นามสกุล   `, "ลายเซ็น", "หมายเหตุ"]],
    alternateRowStyles: { fillColor: [255, 255, 255] },
    styles: {
      font: "THSarabunBold",
      fontSize: 14,
      cellPadding: 1,
      halign: "center",
      valign: "middle",
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 70 },
      3: { cellWidth: 60 },
      4: { cellWidth: 31 },
    },
    margin: { left: 4, right: 0 },
  });
  doc.setFont("THSarabun");

  let y2 = doc.lastAutoTable.finalY;
  let n = 0;
  if (student) {
    for (let i = 0; i < student.length; i++) {
      let gender = "";
      if (student[i].gender == "Male") {
        gender = "นาย";
      }
      if (student[i].gender == "Female") {
        gender = "นางสาว";
      }
      autoTable(doc, {
        startY: y2,
        body: [
          [
            i + 1,
            student[i].studentCode,
            `${gender} ${student[i].firstName}`,
            `${student[i].lastName}`,
            "",
            "",
          ],
        ],
        alternateRowStyles: { fillColor: [255, 255, 255] },
        styles: {
          font: "THSarabun",
          fontSize: 14,
          cellPadding: 1,
          halign: "center",
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30, halign: "center" },
          2: {
            cellWidth: 40,
            halign: "left",
            lineWidth: { right: 0, top: 0.2, bottom: 0.2, left: 0.2 },
            cellPadding: { left: 5, right: 0, top: 1, bottom: 1 },
          },
          3: {
            cellWidth: 30,
            halign: "left",
            lineWidth: { right: 0.2, left: 0, top: 0.2, bottom: 0.2 },
            cellPadding: { left: 0, right: 0, top: 1, bottom: 1 },
          },
          4: { cellWidth: 60 },
          5: { cellWidth: 31 },
        },
        margin: { left: 4, right: 0 },
      });
      y2 += 7;
      if (y2 > 255) {
        doc.addPage()
        y2 = 14;
      }
    }
  }
  if (y2 >255 ){
    doc.addPage()
    y2 = 20
  }else{
    y2 +=15
  }
  doc.setFontSize(16)
  doc.text("ลงชื่อ............................................." , 58 , y2 ,{align:"center"})
  doc.text("(.............................................)" , 58+3 , y2+6 ,{align:"center"})
  doc.text("กรรมการคุมสอบ" , 55+3 , y2+13 ,{align:"center"})

  doc.text("ลงชื่อ............................................." , 147 , y2 ,{align:"center"})
  doc.text("(.............................................)" , 147+3 , y2+6 ,{align:"center"})
  doc.text("กรรมการคุมสอบ" , 147+3 , y2+13 ,{align:"center"})

  doc.save(`${studentGroup}.pdf`);
};
export default StudentNameListPDF;
