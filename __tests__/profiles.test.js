/* eslint-disable */

const { deleteProfile, editProfile } = require("../routes/profiles_functions/profiles_functions");
let profiles = require("../data/profilejson/profiles.json");

describe("deleteProfile", () => {
	it("remove from profiles array: 1 profile by its id", () => {
		const profileToDelete = profiles[0];
		const result = deleteProfile(profileToDelete._id, profiles);
		expect(result).not.toContainEqual(profileToDelete);
	});
});

describe("editProfile", () => {
	it("edit 1 profile", () => {
		const original = profiles[0];
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
