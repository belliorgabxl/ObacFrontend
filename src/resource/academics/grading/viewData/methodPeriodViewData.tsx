import { MethodDto } from "@/dto/methodDto";
import { fetchGetAllMethodData } from "../api/methodPeriodApiData";

export const getMethodViewData = async (): Promise<MethodDto[]> => {
  try {
    const data = await fetchGetAllMethodData();

    const methodViewData = data.map((item: MethodDto) => ({
      id: item.id,
      methodName: item.methodName,
      isAuto: item.isAuto,
      startDate: item.startDate,
      endDate: item.endDate,
      isActive: item.isActive,
    }));

    return methodViewData;
  } catch (error) {
    console.error("Error in getMethodViewData:", error);
    throw new Error("Failed to convert to method view data.");
  }
};
