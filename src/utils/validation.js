const validateAmount = (amount, low, high) => {

    if (parseInt(amount) || parseInt(amount) === 0) {
        amount = parseInt(amount);
        if (low || low === 0) {
            if (high) {
                return (amount <= low || amount > high) ? `Amount phải có giá trị từ ${low} đến ${high}` : "";
            }
            else return amount <= low ? `Amount phải lớn hơn ${low}` : "";
        }
        else {
            if (high) {
                return amount > high ? `Amount phải nhỏ hơn ${high}` : "";
            }
            else return "";
        }
    }
    else return (("Amount phải là giá trị số " + ((low || low === 0) ? `>= ${low} ` : "") + (high ? `và < ${high}` : "")));
}

module.exports = {
    validateAmount
}