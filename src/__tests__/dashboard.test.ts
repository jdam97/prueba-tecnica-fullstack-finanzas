import { getDashboardSummaryService } from "../../services/dashboard.service";

describe("getDashboardSummaryService", () => {
  it("debería retornar un resumen con las propiedades esperadas", async () => {
    const summary = await getDashboardSummaryService();

    expect(summary).toHaveProperty("totalIncome");
    expect(summary).toHaveProperty("totalExpense");
    expect(summary).toHaveProperty("balance");
    expect(summary).toHaveProperty("incomeCount");
    expect(summary).toHaveProperty("expenseCount");
    expect(summary).toHaveProperty("totalTransactions");
    expect(summary).toHaveProperty("totalUsers");

    expect(typeof summary.totalIncome).toBe("number");
    expect(typeof summary.totalExpense).toBe("number");
    expect(typeof summary.balance).toBe("number");
    expect(typeof summary.incomeCount).toBe("number");
    expect(typeof summary.expenseCount).toBe("number");
    expect(typeof summary.totalTransactions).toBe("number");
    expect(
      typeof summary.totalUsers === "number" || summary.totalUsers === undefined
    ).toBe(true);
  });
});
