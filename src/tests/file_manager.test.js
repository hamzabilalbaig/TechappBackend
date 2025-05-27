const request = require("supertest");
const app = require("../../index");

describe("TEST SUITE FOR FILE MANAGER ROUTE", () => {
  describe("This is the GET Api of File Manager", () => {
    it("test that gets files according to the folder it is in, expecting status 200 and success true", async () => {
      const response = await request(app)
        .get("/api/file_manager/files/0")
        .set(
          "token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMywiZW1haWwiOiJ3dXdAZ21haS5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImZpcnN0X25hbWUiOiJUZWNoYXBwIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJpYXQiOjE2NzcxOTAzODIsImV4cCI6MTY3Nzc5NTE4Mn0.6VRknjR2buaROhZKA8VMOm8c4Sx8-NaAZtp_EX2uyKc"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });

    it("test that gets the total size of files, expecting status 200 and success true", async () => {
      const response = await request(app)
        .get("/api/file_manager/avaliableSpace/")
        .set(
          "token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMywiZW1haWwiOiJ3dXdAZ21haS5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImZpcnN0X25hbWUiOiJUZWNoYXBwIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJpYXQiOjE2NzcxOTAzODIsImV4cCI6MTY3Nzc5NTE4Mn0.6VRknjR2buaROhZKA8VMOm8c4Sx8-NaAZtp_EX2uyKc"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });

    it("test that gets folders according to the folder it is in, expecting status 200 and success true", async () => {
      const response = await request(app)
        .get("/api/file_manager/folder/53")
        .set(
          "token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMywiZW1haWwiOiJ3dXdAZ21haS5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImZpcnN0X25hbWUiOiJUZWNoYXBwIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJpYXQiOjE2NzcxOTAzODIsImV4cCI6MTY3Nzc5NTE4Mn0.6VRknjR2buaROhZKA8VMOm8c4Sx8-NaAZtp_EX2uyKc"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });

    it("test that gets recycleBin files , expecting status 200 and success true", async () => {
      const response = await request(app)
        .get("/api/file_manager/getAllRecycleBinFiles/")
        .set(
          "token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMywiZW1haWwiOiJ3dXdAZ21haS5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImZpcnN0X25hbWUiOiJUZWNoYXBwIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJpYXQiOjE2NzcxOTAzODIsImV4cCI6MTY3Nzc5NTE4Mn0.6VRknjR2buaROhZKA8VMOm8c4Sx8-NaAZtp_EX2uyKc"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });

    it("test that gets recycleBin folders, expecting status 200 and success true", async () => {
      const response = await request(app)
        .get("/api/file_manager/getAllRecycleBinFolders/")
        .set(
          "token",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMywiZW1haWwiOiJ3dXdAZ21haS5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImZpcnN0X25hbWUiOiJUZWNoYXBwIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJpYXQiOjE2NzcxOTAzODIsImV4cCI6MTY3Nzc5NTE4Mn0.6VRknjR2buaROhZKA8VMOm8c4Sx8-NaAZtp_EX2uyKc"
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
    });
  });
});
