require("express-async-errors");
const express = require("express");
const routes = require("./routes");
const AppError = require("./utils/App.Error");
const migrationRun = require("./database/sqlite/migrations");

const app = express();
app.use(express.json());
app.use(routes);
app.use(( error, request, response, next ) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});
migrationRun();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is ruinning at Port: ${PORT}`));