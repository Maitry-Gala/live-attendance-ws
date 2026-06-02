import mongoose, { Schema } from "mongoose";

enum Role {
  teacher = "teacher",
  student = "student"
}

enum Status {
  present = "present",
  absent = "absent"
}

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true
  }
});

// Class Schema
const ClassSchema = new Schema({
  className: {
    type: String,
    required: true
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  studentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

// Attendance Schema
const AttendanceSchema = new Schema({
  classId: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: Object.values(Status),
    required: true
  }
});

// Models
export const UserModel = mongoose.model("User", UserSchema);

export const ClassModel = mongoose.model("Class", ClassSchema);

export const AttendanceModel = mongoose.model(
  "Attendance",
  AttendanceSchema
);

export async function connectToMongoDB() {
  try {
    const dbUrl = process.env.MONGODB_URI!;
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}