const deleteProfile = (id, profiles) => {
	profiles = profiles.filter((profile) => profile._id !== id);
	return profiles;
};

const editProfile = (id, newData, profiles) => {
	const profileIndex = profiles.findIndex((profile) => profile._id === id);
	let editedProfile = profiles[profileIndex];
	editedProfile = { ...editedProfile, ...newData, };
	return editedProfile;
};

module.exports = { deleteProfile, editProfile, };
