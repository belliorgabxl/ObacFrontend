import { StudentRegisterData } from "@/dto/registerDto";
import { faker } from "@faker-js/faker";
const facultyNames = ["พาณิชยกรรม", "การท่องเที่ยว"];
const programNames = [
  "การบัญชี",
  "การตลาด",
  "คอมพิวเตอร์ธุรกิจ",
  "คอมพิวกราฟฟิค",
  "การจัดการสำนักงาน",
  "การท่องเที่ยว",
];

export const registerData: StudentRegisterData[] = Array.from(
  { length: 20 },
  (_, index) => ({
    runningNumber: index + 1,
    thaiName: faker.name.firstName("male"), // Assuming male names for simplicity, can be randomized further
    thaiSurname: faker.name.lastName(),
    gender: faker.helpers.arrayElement(["Male", "Female"]),
    birthDate: faker.date
      .birthdate({ min: 18, max: 25, mode: "age" })
      .toISOString()
      .split("T")[0],
    thaiId: faker.string.numeric(13),
    facultyName: faker.helpers.arrayElement(facultyNames),
    programName: faker.helpers.arrayElement(programNames),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(true),
    nationality: faker.helpers.arrayElement(["Thai", "Foreign"]),
    religion: faker.helpers.arrayElement([
      "Buddhism",
      "Christianity",
      "Islam",
      "Hinduism",
      "Other",
    ]),
  })
);
