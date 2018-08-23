const deleteProfile = (id, profiles) => {
	profiles = profiles.filter((profile) => profile._id !== id);
	return profiles;
};

const editProfile = (id, new_data, profiles) => {
	profiles = profiles.map((profile) => {
		if (profile._id === id) {
			profile = { ...profile, ...new_data, };
		}
		return profile;
	});
	const editedProfile = profiles.filter((profile) => profile._id === id)[0];
	return editedProfile;
};

module.exports.deleteProfile = deleteProfile;
module.exports.editProfile = editProfile;
