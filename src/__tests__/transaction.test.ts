import { getTransactionsService } from "../../services/transaction.service";

describe("getTransactionsService", () => {
  it("debería retornar un arreglo de transacciones", async () => {
    const transactions = await getTransactionsService();

    // Verifica que el resultado sea un array
    expect(Array.isArray(transactions)).toBe(true);

    // Si hay transacciones, verifica algunas propiedades
    if (transactions.length > 0) {
      const tx = transactions[0];
      expect(tx).toHaveProperty("id");
      expect(tx).toHaveProperty("concept");
      expect(tx).toHaveProperty("amount");
      expect(tx).toHaveProperty("date");
      expect(tx).toHaveProperty("type");
      expect(tx).toHaveProperty("user");
      expect(tx.user).toHaveProperty("name");
      expect(tx.user).toHaveProperty("email");
    }
  });
});
