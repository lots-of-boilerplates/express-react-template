import express, { Request, Response } from "express";

const app = express();

app.get("/api", (_: Request, res: Response) => {
  res.send({ message: "api is connected" });
});

// IMPORTANT - This must come after all of your api routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// @ts-ignore to fix this, add .env
app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running");
});
