import mongoose from "mongoose";


const AppSchema = new mongoose.Schema({
  appName : {
    type : String,
    required : true
  },
  apiKeyHash: String,
  apiKeyEncrypted: { iv: String, cipher: String },
  created_at : {
    type : Date,
    default : Date.now
  },
  
})

const OpenApiSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
  },
  apps : [AppSchema],
  apiCalls :{
    type : Number,
    default : 0
  }
})

OpenApiSchema.pre('save', function(next) {
  if (!this.isModified('ApiCalls')) {
    return next();
  }

  this.apiCalls += 1;
  next();
});

const OpenApi = mongoose.model('OpenApi', OpenApiSchema);
export default OpenApi;