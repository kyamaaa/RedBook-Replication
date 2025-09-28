import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // 前端开发服务器地址
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api/auth", authRoutes);

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Authentication service is running" });
});

// 错误处理中间件
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      code: 500,
      message: "服务器内部错误",
    });
  }
);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: "接口不存在",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 认证服务运行在端口 ${PORT}`);
});
