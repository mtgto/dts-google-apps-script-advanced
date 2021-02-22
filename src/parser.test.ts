import { normalizePackageName, parseHierarchy } from "./parser";

test("normalize package names", () => {
  expect(normalizePackageName("Peopleapi_v1", false)).toBe("People");
  expect(normalizePackageName("Peopleapi_v1.Peopleapi.V1.Collection", false)).toBe("People.Collection");
  expect(normalizePackageName("Peopleapi.V1.Schema.ModifyContactGroupMembersRequest", false)).toBe("Schema.ModifyContactGroupMembersRequest");
  expect(normalizePackageName("Peopleapi_v1.Peopleapi.V1.Schema.ModifyContactGroupMembersResponse", true)).toBe("Schema.ModifyContactGroupMembersResponse");
});

test("parse json object", () => {
  const obj = {
    "1": "Peopleapi_v1",
    "2": [
      {
        "1": "ContactGroups",
        "2": "Peopleapi_v1.Peopleapi.V1.Collection.ContactGroupsCollection",
        "3": 1,
      },
    ],
  };
  const parsed = parseHierarchy(obj);
  expect(parsed.name).toBe("People");
});
