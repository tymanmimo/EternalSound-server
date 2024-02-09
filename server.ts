import express from 'express';
import mongoose from 'mongoose';

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const mroutes = require('./routes/music');

const db = 'mongodb+srv://EternalUser:trytofindme@EternalCluster.jjvus5w.mongodb.net/EternalSound?retryWrites=true&w=majority'

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use('/api', routes);
app.use('/mapi', mroutes);

const port = 3001;
app.listen(port, async () => {
  mongoose.connect(db)
    .then((res: any) => console.log('Connected to DB'))
    .catch((error: any) => console.log(error));
  console.log(`Server running on port ${port}`);
});

process.on('exit', async () => {
  await mongoose.disconnect;
});
