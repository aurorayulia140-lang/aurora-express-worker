
import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";
import express from "express";

const app = express();

app.use(express.json());

// API 1: API biasa
app.get("/api/hello", (req, res) => {
  console.log("API Hello diakses");
  res.json({
    message: "Hello from Express API!",
    success: true,
  });
});

// API 2: API status
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    success: true,
  });
});

// API 3: API info
app.get("/api/info", (req, res) => {
  res.json({
    app: "Aurora Express Worker",
    framework: "Express.js",
    platform: "Cloudflare Workers",
    version: "1.0.0",
  });
});

// API 4: API log test
app.get("/api/log-test", (req, res) => {
  console.log("LOG TEST: Endpoint berhasil diakses");
  res.json({
    message: "Log test berhasil",
    logged: true,
  });
});

// API 5: API time
app.get("/api/time", (req, res) => {
  res.json({
    time: new Date().toISOString(),
    timezone: "UTC",
  });
});

// CRUD 1: GET semua siswa
app.get("/api/students", async (req, res) => {
  try {
    const { results } = await env.paas_students_db
      .prepare("SELECT * FROM students ORDER BY id")
      .all();

    res.json({
      success: true,
      students: results,
    });
  } catch (error) {
    console.error("Gagal mengambil data siswa:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data siswa",
    });
  }
});

// CRUD 2: GET siswa berdasarkan ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "ID siswa tidak valid",
      });
      return;
    }

    const student = await env.paas_students_db
      .prepare("SELECT * FROM students WHERE id = ?")
      .bind(id)
      .first();

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Siswa tidak ditemukan",
      });
      return;
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Gagal mengambil detail siswa:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail siswa",
    });
  }
});

// CRUD 3: POST tambah siswa
app.post("/api/students", async (req, res) => {
  try {
    const name =
      typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const className =
      typeof req.body?.class_name === "string"
        ? req.body.class_name.trim()
        : "";

    if (!name || !className) {
      res.status(400).json({
        success: false,
        message: "Nama dan kelas wajib diisi",
      });
      return;
    }

    const result = await env.paas_students_db
      .prepare(
        "INSERT INTO students (name, class_name) VALUES (?, ?)"
      )
      .bind(name, className)
      .run();

    res.status(201).json({
      success: true,
      message: "Siswa berhasil ditambahkan",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error("Gagal menambahkan siswa:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan siswa",
    });
  }
});

// CRUD 4: PUT memperbarui siswa
app.put("/api/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const name =
      typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const className =
      typeof req.body?.class_name === "string"
        ? req.body.class_name.trim()
        : "";

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "ID siswa tidak valid",
      });
      return;
    }

    if (!name || !className) {
      res.status(400).json({
        success: false,
        message: "Nama dan kelas wajib diisi",
      });
      return;
    }

    const result = await env.paas_students_db
      .prepare(
        "UPDATE students SET name = ?, class_name = ? WHERE id = ?"
      )
      .bind(name, className, id)
      .run();

    if (result.meta.changes === 0) {
      res.status(404).json({
        success: false,
        message: "Siswa tidak ditemukan",
      });
      return;
    }

    res.json({
      success: true,
      message: "Data siswa berhasil diperbarui",
    });
  } catch (error) {
    console.error("Gagal memperbarui siswa:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui siswa",
    });
  }
});

// CRUD 5: DELETE menghapus siswa
app.delete("/api/students/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        success: false,
        message: "ID siswa tidak valid",
      });
      return;
    }

    const result = await env.paas_students_db
      .prepare("DELETE FROM students WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      res.status(404).json({
        success: false,
        message: "Siswa tidak ditemukan",
      });
      return;
    }

    res.json({
      success: true,
      message: "Siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus siswa:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus siswa",
    });
  }
});

// Endpoint utama
app.get("/", (req, res) => {
  res.json({
    message: "Express.js running on Cloudflare Workers!",
  });
});

app.listen(3000);

export default httpServerHandler({ port: 3000 });