import mongoose from "mongoose"; //importing mongoose

//creating a schema -> takes object
const userSchema = new mongoose.Schema(
  {
    // data
    username: {
      type: String,
      required: true, //if this field is not filled,
      //  it will throw an error or no data will be saved
      unique: true, //for unique username.
      lowercase: true, // for making username all lowe case.
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // to add createdat time and updated at time in database
);

//exprting mongoose
//model(name_of_model, on_What_basis);
//creating model name User on the basis of userSchema
export const User = mongoose.model("User", userSchema);
