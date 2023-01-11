module.exports = {
    userSession: (req, res, next) => {
        if (req.session.userlogin) {
            next()
        }
        else {
            res.redirect('/login')
        }
    },

    adminSession: (req, res, next) => {
        if (req.session.adminLogin) {
            next()
        }
        else {
            res.redirect('/admin')
        }
    }
};
