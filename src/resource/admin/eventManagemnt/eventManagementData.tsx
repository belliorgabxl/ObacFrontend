import { GetEventManagement } from "@/dto/eventDto";
import { format } from "date-fns";
import { faker } from "@faker-js/faker";

export const exampleEventManagementData: GetEventManagement[] = Array.from(
  { length: 20 },
  (_, index) => ({
    blogId: index + 1,
    blogName: faker.lorem.words(),
    description: faker.lorem.sentence(),
    startDate: format(new Date(faker.date.past()), "dd MMM yyyy"),
    endDate: format(new Date(faker.date.future()), "dd MMM yyyy"),
  })
);
