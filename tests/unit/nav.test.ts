import { describe, it, expect } from "vitest";
import { NAV_ITEMS } from "@/lib/nav";

describe("NAV_ITEMS", () => {
  it("tem 10 itens, de Início a Perfil", () => {
    expect(NAV_ITEMS).toHaveLength(10);
    expect(NAV_ITEMS[0].label).toBe("Início");
    expect(NAV_ITEMS[9].label).toBe("Perfil");
  });
  it("Simulados chega na fase 6", () => {
    expect(NAV_ITEMS.find((i) => i.label === "Simulados")?.fase).toBe(6);
  });
});
