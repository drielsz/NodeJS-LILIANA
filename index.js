const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const appCustom = require('./config/appCustom');

app.use(cors());
appCustom(app, express);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});