export function inputRupiahFormatted(input: any) {
    var plainNumber = input.value.replace(/[^\d]/g, "");

    var formattedValue = new Intl.NumberFormat("id-Id", {
        currency: "IDR"
    }).format(plainNumber);

    input.value = formattedValue;
};
