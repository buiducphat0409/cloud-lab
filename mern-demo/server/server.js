const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin không được phép bởi CORS"));
      }
    },
  }),
);

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// =========================
// MongoDB
// =========================

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// =========================
// Student Model
// =========================

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", studentSchema);

// =========================
// API Hello
// =========================

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend MERN đang hoạt động!",
  });
});

// =========================
// GET - Lấy danh sách sinh viên
// =========================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách sinh viên",
      error: error.message,
    });
  }
});

// =========================
// POST - Thêm sinh viên
// =========================

app.post("/api/students", async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = await Student.create({
      studentId,
      name,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({
      message: "Lỗi thêm sinh viên",
      error: error.message,
    });
  }
});

// =========================
// PUT - Cập nhật sinh viên
// =========================

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        studentId: req.body.studentId,
        name: req.body.name,
        email: req.body.email,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: "Lỗi cập nhật sinh viên",
      error: error.message,
    });
  }
});

// =========================
// DELETE - Xóa sinh viên
// =========================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Không tìm thấy sinh viên",
      });
    }

    res.json({
      message: "Xóa sinh viên thành công",
      student,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi xóa sinh viên",
      error: error.message,
    });
  }
});
