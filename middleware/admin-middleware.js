

const isAdminUser = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        return res.status(200).json({
            success : false,
            message : 'Acess denied! Admin rights required'
        });
    };
    next();
};

export {isAdminUser};