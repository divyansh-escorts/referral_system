
const router = require('express').Router()
router.get("/", (req, res) => {
    console.log("GET / request");
    res.status(200).json({ success: true, message: "Welcome to the backend." });
});
router.use('/authenticate' ,require('./authRoutes'))
router.use('/transaction' ,require('./transactionRoutes'))
// router.use('/referral' ,require('./referral'))

router.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

module.exports= router