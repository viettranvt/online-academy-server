const getFavoritesList = require("./get-favorites-list.test");
const addFavorite = require('./add-favorite.test');
const deleteFavorite = require('./delete-favorite.test');

module.exports = () => {
    getFavoritesList();
    addFavorite();
    deleteFavorite();
};