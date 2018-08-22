/* eslint-disable */

const functions = require("../view_functions/profiles_functions");
let profiles = require("../data/profilejson/profiles.json");

describe("delete profile function tests", () => {
	it("remove from profiles array: 1 profile by its id", () => {
		const deleteProfile = functions.deleteProfile;
		const profileToDelete = profiles[0];
		const result = deleteProfile(profileToDelete._id, profiles);
		expect(result).toEqual(expect.not.arrayContaining([profileToDelete]));
	});
});

describe("edit profile function tests", () => {
	it("edit 1 profile", () => {
		const original = { ...profiles[0] };
		const editProfile = functions.editProfile;
		const result = editProfile(
			original._id,
			{
				firstName: "Test First name",
				lastName: "Test Last name",
			},
			profiles
		);
		expect(result.firstName).toEqual("Test First name");
		expect(result.firstName).not.toEqual(original.firstName);
	});
});
