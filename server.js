import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

// const PORT = process.env.PORT || 3000;
connectToDB();
app.listen(3000,()=>{
    console.log(`Server is running `)
})