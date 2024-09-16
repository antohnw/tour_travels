const db = require('../db');

function Destinations({
    destination_id = null,
    destination_name,
    country,
    description,
    pictures = [],
    videos = [],
    map_locations = {},
    activities = []
}) {
    this.destination_id = destination_id;
    this.destination_name = destination_name;
    this.country = country;
    this.description = description;
    this.pictures = pictures;
    this.videos = videos;
    this.map_locations = map_locations;
    this.activities = activities;
}
//create destinations
Destinations.prototype.createDestination = async function () {
    try {
        const result = await db.query(
            `INSERT INTO destinations(destination_name, country, description, pictures,
            videos, map_locations, activities)
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING destination_id`,
            [
                this.destination_name,
                this.country,
                this.description,
                this.pictures,
                this.videos,
                this.map_locations,
                this.activities
            ]
        );
        this.destination_id = result.rows[0].destination_id;
        return this;
    } catch (error) {
        throw error;
    }
}
// find all destinations
Destinations.findAllDestinations = async function () {
    try {
        const result = await db.query(`SELECT * FROM destinations`);
        //const result = await db.query(`SELECT * FROM customers`);

        return result.rows;
    } catch (error) {
        throw error;
    }
}
module.exports = Destinations;