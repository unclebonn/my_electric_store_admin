export const formatCurrencyVN = (amountMoney: number) => {
    return amountMoney.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    })
}