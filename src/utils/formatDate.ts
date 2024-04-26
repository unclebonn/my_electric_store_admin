import dayjs, { Dayjs } from "dayjs"

export const getDateTodayVN = (date: string) => {
    return dayjs(date).locale("vi")
}


export const formatDate = (rawString: string) => {
    return new Date(rawString).toLocaleString("vi-VN");

}