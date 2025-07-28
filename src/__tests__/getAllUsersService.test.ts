/* eslint-env jest */
import { getAllUsersService } from "../../services/user.service";

describe("getAllUsersService", () => {
  it("debería retornar un arreglo de usuarios", async () => {
    const users = await getAllUsersService();

    // Verifica que el resultado sea un array
    expect(Array.isArray(users)).toBe(true);

    //verifica el usuario
    if (users.length > 0) {
      const user = users[0];
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("role");
    }
  });
});
