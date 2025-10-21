import { connect } from 'mongoose';

const connectDB = async (uri) => {
  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
};

export default connectDB;
