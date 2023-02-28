const initModels = require('../models/init-models');
const sequelize = require('../models/index');
const { errorCode, successCode, failCode, notFoundCode } = require('../config/response');

const model = initModels(sequelize);

const likeRes = async (req, res) => {
    try {
        const { user_id, res_id } = req.body;

        //new modal
        const modalLikeRes = {
            user_id,
            res_id,
            date_like: new Date()
        }

        //validate user + restaurent
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

        if (!user || !restaurent) {
            return failCode(res, {
                ...(!user && { USERNAME_ERR: "User không tồn tại" }),
                ...(!restaurent && { RESTAURANT_ERR: "Restaurent không tồn tại" }),
            });
        }

        //check data exist
        const resLikeExist = await model.like_res.findOne({
            where: {
                user_id,
                res_id
            }
        })

        if (resLikeExist) {
            return failCode(res, "Trùng dữ liệu. User đã like restaurent trước đó rồi")
        }

        await model.like_res.create(modalLikeRes);
        return successCode(res, modalLikeRes, "Tạo mới thành công");
    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

const unLikeRes = async (req, res) => {
    try {
        const { user_id, res_id } = req.body;

        //validate user + restaurent + like
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

        if (!user || !restaurent) {
            return failCode(res, {
                ...(!user && { USERNAME_ERR: "User không tồn tại" }),
                ...(!restaurent && { RESTAURANT_ERR: "Restaurent không tồn tại" }),
            });
        }

        const resLikeExist = await model.like_res.findOne({
            where: {
                user_id,
                res_id
            }
        })

        if (!resLikeExist) {
            return failCode(res, "Dữ liệu không hợp lệ. User chưa like restaurant!")
        }

        const resLikes = await model.like_res.destroy({
            where: {
                user_id,
                res_id
            }
        });

        return successCode(res, resLikes, "Unlike thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE")
    }
}

const getLikeResByRestaurant = async (req, res) => {
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

        const resLikesList = await model.like_res.findAll({
            where: {
                res_id
            }
        })

        if (!resLikesList || !resLikesList.length) {
            return notFoundCode(res, "Không tìm thấy ds like_res nào!")
        }

        return successCode(res, resLikesList, "Truy vấn like_res theo restaurant thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

const getLikeResByUser = async (req, res) => {
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

        const resLikesList = await model.like_res.findAll({
            where: {
                user_id
            }
        })

        if (!resLikesList || !resLikesList.length) {
            return notFoundCode(res, "Không tìm thấy ds like_res nào!")
        }

        return successCode(res, resLikesList, "Truy vấn like_res theo user thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

const getLikeResList = async (req, res, next) => {
    try {
        const { user_id, res_id } = req.query;

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

        const resLikes = await model.like_res.findAll({
            where: {
                ...(user_id && { user_id }),
                ...(res_id && { res_id }),
            }
        })

        if (!resLikes || !resLikes.length) {
            return notFoundCode(res, "Không tìm thấy ds like_res nào!")
        }

        return successCode(res, resLikes, "Truy vấn like_res thành công");

    } catch (err) {
        console.log(err);
        return errorCode(res, "Lỗi BE");
    }
}

module.exports = {
    likeRes,
    unLikeRes,
    getLikeResByRestaurant,
    getLikeResByUser,
    getLikeResList
}