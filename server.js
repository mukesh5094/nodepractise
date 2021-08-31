const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('./db');


const leadsRouter = require('./routes/leadRoute');
const rolesRouter = require('./routes/roleRoute');
const usersRouter = require('./routes/userRoute');
const usersAuth = require('./routes/userAuth');
const port = 3000;
// app.use(express.json());
app.use(bodyParser.json());

app.use('/', router);
app.use('/auth', usersAuth);
app.use('/leads', leadsRouter);
app.use('/roles', rolesRouter);
app.use('/users', usersRouter);

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
})
