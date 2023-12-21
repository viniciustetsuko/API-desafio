const knex = require("../database/knex");
const AppError = require("../utils/App.Error");

class MoviesController {
    async create(request, response) {
        const { title, description, rating, movies_tags } = request.body; 
        const { user_id } = request.params;
        

        if (rating < 1 || rating > 5) {
            throw new AppError("Rating must be between 1 and 5");
        }
    

        const  [ movies_id ] = await knex("movies").insert({
            title,
            description,
            rating,
            user_id,
        })

        

        const moviesTagsInsert = movies_tags.map(name => {
            return {
                movies_id,
                name,
                user_id,
            }
        });

        console.log(moviesTagsInsert);

        await knex("movies_tags").insert(moviesTagsInsert);

        response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const movies = await knex("movies").where({ id }).first();
        const movies_tags = await knex("movies_tags").where({ movies_id: id }).orderBy("name");

        return response.json({
            ...movies,
            movies_tags
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex.raw('PRAGMA foreign_keys = ON;');
        
        await knex("movies").where({ id }).delete();
        

        return response.json();
    }

    async index(request, response) {
        const { user_id, title, movies_tags } = request.query;

        let movies;

        if (movies_tags) {
            const filterTags = movies_tags.split(',').map(tag => tag.trim());

            movies = await knex("movies_tags")
            .select([
               "movies.id",
               "movies.title",
               "movies.user_id",
            ])
            .where("movies.user_id", user_id)
            .whereLike("movies.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movies", "movies.id", "movies_tags.movies_id")
            .orderBy("movies.title")

        }else {

            movies = await knex("movies")
            .where({ user_id})
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        }

        const userMovies_tags = await knex("movies_tags").where({ user_id });

        const moviesWithTags = movies.map(movie => {
            const movieTags = userMovies_tags.filter(tag => tag.movies_id === movie.id);

            return {
                ...movie,
                tags: movieTags
            }
        });

        return response.json( moviesWithTags );
    }
}

module.exports = MoviesController;