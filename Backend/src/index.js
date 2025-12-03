import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors";
import UserRouter from "./routes/Userroutes.js";
import tokencheck from "./middleware/authconrroller.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDb(process.env.Mongo_Url)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("DB Error:", err));

app.use("/user", UserRouter);

app.post("/test", tokencheck,(req, res) => {
	res.json({ message: "POST working" });
});

app.get("/", (req, res) => {
	res.json("Backend");
});

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
	console.log(`server is running on http://localhost:${Port}`);
});
