
    userSession= (req, res, next) => {
        if (req.session.userLogin) {
            next()
        }
        else {
            res.redirect('/login')
        }
    }

    adminSession= (req, res, next) => {
        if (req.session.adminLogin) {
            next()
        }
        else {
            res.redirect('/admin')
        }
    }

    module.exports = {
        userSession,
        adminSession,

    }
