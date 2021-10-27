const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.log('Unable to connect to mongoBD   ', err);
    process.exit();
})