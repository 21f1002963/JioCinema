const UserModel = require('../MODEL/UserModel');
const { tmdbAPI, TMDB_ENDPOINT } = require('../SERVICES/tmdb.services');

const createUser = async function(req, res){
    try {
        const userObject = req.body;
        const user = await UserModel.create(userObject);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const getAllUsers = async function(req, res){
    try{
        const user = await UserModel.find();

        if(user.length != 0){
            res.status(200).json({
                message: user
            })
        }else{
            res.status(404).json({
                message: "No users found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const getUserById = async function(req, res){
    try{
        const id = req.params.id;
        const user = await UserModel.findById(id);

        if(user){
            res.status(200).json({
                message: user
            })
        }else{
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const deleteUserById = async function(req, res){
    try{
        let id = req.params.id;
        const user = await UserModel.findByIdAndDelete(id);
        if(user === null){
            res.status(404).json({
                staus:"success",
                message: "User not found"
            })
        } else{
            res.status(200).json({
                status: "success",
                message: "User deleted successfully",
                user: user
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

// Current User
const getCurrentUser = async function(req, res){
    try{
        const userId = req.userId;
        const { _id, name, email, createdAt, wishList, isPremium } = await UserModel.findById(userId);

        res.status(200).json({
            user:{_id,
            name,
            email,
            createdAt,
            wishList,
            isPremium
            },
            status: "success"
    })
    } catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error
        })
    }
}

const getUserWishlist = async function(req, res){
    try{
        const userId = req.userId;
        const user = await UserModel.findById(userId);
        res.status(200).json({
            status: "success",
            data: user.wishList
        })
    } catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const addToWishlist = async function(req, res){
    try{
        const userId = req.userId;
        const { id, media_type } = req.body;
        const user = await UserModel.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        let postItem;
        if (media_type == "tv") {
            postItem = (await tmdbApi.get(TMDB_ENDPOINT.fetchTvShowDetails(id))).data;
          } else {
            postItem = (await tmdbApi.get(TMDB_ENDPOINT.fetchMovieDetails(id))).data;
        }

        const wishlistItem = {
            poster_path: postItem.poster_path,
            name: postItem.title,
            id: postItem.id,
            media_type: media_type,
        };

        /**if(user.wishList.find((item) => item.id === id)){
            return res.status(400).json({
                message: "Item already in wishlist",
                status: "failed"
            }) 
        }**/

        user.wishList.push({wishlistItem});

        await UserModel.findByIdAndUpdate(
            {_id: userId},
            {$push: {wishList: user.wishlistItem}},
            {new: true, upsert: true}
        );

        res.status(200).json({
            status: "success",
            message: "Added to wishlist"
        })
    } catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

module.exports = {
    getCurrentUser,
    addToWishlist,
    getUserWishlist,
    createUser,
    getAllUsers,
    getUserById,
    deleteUserById
}