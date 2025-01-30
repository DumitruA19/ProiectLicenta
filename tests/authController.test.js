const request = require("supertest");
const app = require("../app");
const { poolPromise } = require("../config/dbConfig"); // Importă conexiunea DB

describe("Autentificare API", () => {
  let server;

  beforeAll(() => {
    server = app.listen(5001); // Rulează serverul pe un port separat
  });

  afterAll(async () => {
    try {
      if (poolPromise) {
        const pool = await poolPromise;
        await pool.close(); // Închide conexiunea SQL
      }
      if (server) {
        await server.close(); // Închide serverul
      }
    } catch (error) {
      console.error("Eroare la închiderea resurselor:", error);
    }
  });

  test("Autentificare cu date valide", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "john.doe@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Autentificare cu date greșite", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "admin@example.com", password: "gresit" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
  });
  const addLog = async (userId, action, details) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("user_id", userId)
            .input("action", action)
            .input("details", details)
            .query("INSERT INTO logs (user_id, action, details, created_at) VALUES (@user_id, @action, @details, GETDATE())");
    } catch (error) {
        console.error("Error adding log:", error);
    }
};

module.exports = { addLog };
});
