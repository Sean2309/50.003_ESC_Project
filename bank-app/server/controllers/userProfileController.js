// const UserProfile = require('../models/userProfile');

// class UserProfileController {
    
//     authenticateToken(request, response, next) {
//         // some logic to verify the auth token 
//         next();
//     }

//     // This function operates on the assumption that the token is authed   
//     getUserProfile = async (request, response) => {
//         const userId = request.query.id;
        
//         // ideally userId is hashed, so we need to decrypt this

//         const userProfile = await UserProfile.findOne({ userId: userId });

//         response.json(userProfile);
//     }
// };

// const userProfileController = new UserProfileController();

// module.exports = userProfileController;