const register = (req, res) => {
    res.status(200).json({
        message: 'Register route works',
    });
};

module.exports = {
    register,
};