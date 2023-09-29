import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    value: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Rate = mongoose.models.Rate || mongoose.model('Rate', rateSchema);
export default Rate;
