const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('./db');


const leadsRouter = require('./routes/leadRoute');
const rolesRouter = require('./routes/roleRoute');
const usersRouter = require('./routes/userRoute');

// app.use(express.json());
app.use(bodyParser.json());

app.use('/', router);

app.use('/leads', leadsRouter);
app.use('/roles', rolesRouter);
app.use('/users', usersRouter);

app.listen(4000, ()=>{
    console.log('server is running at port 4000');
})
