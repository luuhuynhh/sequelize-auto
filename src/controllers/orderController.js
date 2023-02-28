const initModels = require('../models/init-models');
const sequelize = require('../models/index');
const { errorCode, failCode, successCode } = require("../config/response");
const { validateAmount } = require('../utils/validation');

const model = initModels(sequelize);

const createOrder = async (req, res) => {
    try {
        const {
            user_id,
            food_id,
            amount,
            code,
            arr_sub_id
        } = req.body;

        //validate user + food + amount
        const user = await model.user.findOne({
            where: {
                user_id
            }
        })

        const food = await model.food.findOne({
            where: {
                food_id
            }
        })

        const errAmount = validateAmount(amount, 0);

        const tryParseJSONArray = (jsonString) => {
            try {
                var o = JSON.parse(jsonString);

                if (o && Array.isArray(o)) {
                    return o;
                }

                return false;
            }
            catch (e) { }
            return false;
        };

        const arrSubFood = tryParseJSONArray(arr_sub_id);

        let errSubFood = "";
        if (!arrSubFood || !arrSubFood.length) {
            errSubFood = "Sub Food Array phải là mảng sub_food_id tương ứng";
        }

        if (food && arrSubFood && arrSubFood.length) {
            const subFoodPromises = arrSubFood.map(subFoodId => model.sub_food.findOne({
                where: {
                    food_id,
                    sub_id: subFoodId
                }
            }))

            const subFoodRes = await Promise.all([...subFoodPromises]);
            for (let sFood of subFoodRes) {
                console.log(sFood);
                if (!sFood) {
                    errSubFood = "Tồn tại Sub Food Id không nằm trong Food đó";
                    break;
                }
            }
        }

        if (!user || !food || errAmount || errSubFood) {
            return failCode(res, {
                ...(!user && { USER_ERR: "User không tồn tại" }),
                ...(!food && { FOOD_ERR: "Food không tồn tại" }),
                ...(errAmount && { AMOUNT_ERR: errAmount }),
                ...(errSubFood && { SUBFOOD_ERR: errSubFood })
            })
        }

        const OrderModal = {
            user_id,
            food_id,
            amount,
            code,
            arr_sub_id
        }

        await model.order.create(OrderModal);
        successCode(res, OrderModal, "Đặt món thành công");
    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

module.exports = {
    createOrder
}