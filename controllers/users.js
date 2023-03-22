import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((friend_id) => {
                return User.findById(friend_id);
            })
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {
                    _id, firstName, lastName, occupation, location, picturePath
                };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((f_id) => f_id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        // fetch list of updated friends
        const friends = await Promise.all(
            user.friends.map((friend_id) => {
                console.log(friend_id);
                return User.findById(friend_id)
            })
        );
        if(!friends) return res.status(200).json(friends);
        // format friends
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {
                    _id, firstName, lastName, occupation, location, picturePath
                };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        console.log('Error: ', err);
        res.status(501).json({
            error: err.message
        });
    }
};