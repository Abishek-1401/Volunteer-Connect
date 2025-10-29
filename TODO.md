# TODO: Add Follower Count, View/Remove Followers, and Edit Profile Images

## Backend Changes
- [x] Add `coverImage` field to userModel.js
- [x] Add `getFollowers` function in userController.js
- [x] Add `updateProfile` function in userController.js for updating profile with images
- [x] Add routes in userRoutes.js: GET /:id/followers and PUT /update-profile

## Frontend Changes
- [x] Create FollowersModal component (FollowersModal.jsx and FollowersModal.css)
- [x] Update ProfileHeader.jsx: Fetch and display follower count, make it clickable to open modal, use user.coverImage and profileImage
- [x] Update EditProfilePage.jsx: Add file inputs for profile and cover images, handle form submission with FormData

## Testing
- [x] Test follower count display and modal opening
- [x] Test viewing followers list and unfollow functionality
- [x] Test image uploads in edit profile
- [x] Test image display in profile header
