const { hash, compare } = require( "bcryptjs");
const AppError = require("../utils/App.Error");
const sqliteConnection = require("../database/sqlite");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body
        const database = await sqliteConnection();
        const checkUsersExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (checkUsersExists) {
            throw new AppError("this email already exists!");
        }

        const hashedPassword = await hash(password, 8);

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
        );

        return response. status(201).json();

    }

    async update( request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;
        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if (!user) {
            throw new AppError("User not found!")
        };

        const userUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (userUpdatedEmail && userUpdatedEmail.id !== user.id) {
            throw new AppError("This email is already in use!")
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError(" You need to enter your old passwords first!")
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("Wrong old password!");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        );

        return response.json();

    }
}

module.exports = UsersController;