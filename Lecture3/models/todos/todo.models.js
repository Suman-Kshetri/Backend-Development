import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    // the box containing sub todo should have name [title]
    content: {
      type: String,
      required: true,
    },
    //if all todo is done then marked complete
    complete: {
      type: Boolean,
      dafault: false,
    },
    // if many user are using it then: the creator name;
    createdBy: {
      //this should be related to user so:
      //giving the reference of the user:
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //array of sub todos
    subTodos: [
      {
        type: mongoose.Schema.Typees.ObjectId,
        ref: "SubTodo",
      },
    ],
  },
  { timestamps: true }
);
export const Todo = mongoose.model("Todo", todoSchema);
