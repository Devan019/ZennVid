import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    required:  true
  },
  credits_received : {
    type: Number,
    required : true
  },
  payment_id : {
    type : String,
    required: true
  },
  amount : {
    type: Number,
    required : true
  }
},
{
  timestamps : true
})

export const Transaction = mongoose.models.Transaction ?? mongoose.model("Transaction", TransactionSchema);