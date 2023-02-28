const initModels = require('../models/init-models');
const sequelize = require('../models/index');
const { errorCode, successCode, failCode, notFoundCode } = require('../config/response');
const { validateAmount } = require('../utils/validation');

const model = initModels(sequelize);

const createRateRes = async (req, res) => {
    try {
        const { user_id, res_id, amount } = req.body;

        //new modal
        const modalRateRes = {
            user_id,
            res_id,
            date_rate: new Date(),
            amount
        }

        //validate user + restaurent + amount
        const user = await model.user.findOne({
            where: {
                user_id
            }
        })

        const restaurent = await model.restaurant.findOne({
            where: {
                res_id
            }
        })

        const errValidateAmount = validateAmount(amount, 0, 5);

        if (!user || !restaurent || errValidateAmount) {
            return failCode(res, {
                ...(!user && { USERNAME_ERR: "User không tồn tại" }),
                ...(!restaurent && { RESTAURANT_ERR: "Restaurent không tồn tại" }),
                ...(errValidateAmount && { AMOUNT_ERR: errValidateAmount })
            });
        }

        //check data exist
        const resRateExist = await model.rate_res.findOne({
            where: {
                user_id,
                res_id
            }
        })

        if (resRateExist) {
            return failCode(res, "Trùng dữ liệu. User đã đánh giá restaurent trước đó rồi")
        }

        await model.rate_res.create(modalRateRes);
        return successCode(res, modalRateRes, "Tạo mới thành công");
    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}


const getRateResByRestaurant = async (req, res) => {
    try {
        const { res_id } = req.params;
        const restaurent = await model.restaurant.findOne({
            where: {
                res_id
            }
        })

        if (!restaurent) {
            return failCode(res, "Restaurent không tồn tại");
        }

        const resRatesList = await model.rate_res.findAll({
            where: {
                res_id
            }
        })

        if (!resRatesList || !resRatesList.length) {
            return notFoundCode(res, "Không tìm thấy ds rate_res nào!")
        }

        return successCode(res, resRatesList, "Truy vấn rate_res theo restaurant thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

const getRateResByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await model.user.findOne({
            where: {
                user_id
            }
        })

        if (!user) {
            return failCode(res, "User không tồn tại");
        }

        const resRatesList = await model.rate_res.findAll({
            where: {
                user_id
            }
        })

        if (!resRatesList || !resRatesList.length) {
            return notFoundCode(res, "Không tìm thấy ds rate_res nào!")
        }

        return successCode(res, resRatesList, "Truy vấn rate_res theo user thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

const getRateResList = async (req, res, next) => {
    try {
        const { res_id, user_id } = req.query;

        if (user_id) {
            const user = await model.user.findOne({
                where: {
                    user_id
                }
            })

            if (!user) {
                return failCode(res, "User không tồn tại");
            }
        }

        if (res_id) {
            const restaurent = await model.restaurant.findOne({
                where: {
                    res_id
                }
            })

            if (!restaurent) {
                return failCode(res, "Restaurent không tồn tại");
            }
        }

        const rateRes = await model.rate_res.findAll({
            where: {
                ...(user_id && { user_id }),
                ...(res_id && { res_id }),
            }
        })

        if (!rateRes || !rateRes.length) {
            return notFoundCode(res, "Không tìm thấy ds rate_res nào!")
        }

        return successCode(res, rateRes, "Truy vấn rate_res thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

module.exports = {
    createRateRes,
    getRateResByRestaurant,
    getRateResByUser,
    getRateResList
}