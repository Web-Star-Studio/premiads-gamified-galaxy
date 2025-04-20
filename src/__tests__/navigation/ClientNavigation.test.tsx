
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import ClientHeader from "@/components/client/ClientHeader";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";

describe("Client Navigation", () => {
  // Test Header Navigation
  describe("Client Header", () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <ClientHeader />
        </MemoryRouter>
      );
    });

    it("renders notifications link that navigates correctly", () => {
      const notificationsLink = screen.getByRole("link", { name: /notifications/i });
      expect(notificationsLink).toHaveAttribute("href", "/cliente/notificacoes");
    });

    it("renders profile link that navigates correctly", () => {
      const profileLink = screen.getByRole("link", { name: /perfil/i });
      expect(profileLink).toHaveAttribute("href", "/cliente/perfil");
    });

    it("renders home link that navigates correctly", () => {
      const homeLink = screen.getByRole("link", { name: /premiads/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  // Test Sidebar Navigation
  describe("Client Sidebar", () => {
    beforeEach(() => {
      render(
        <MemoryRouter>
          <ClientSidebar userName="Test User" />
        </MemoryRouter>
      );
    });

    const sidebarLinks = [
      { name: "Dashboard", path: "/cliente" },
      { name: "Missões", path: "/cliente/missoes" },
      { name: "Perfil", path: "/cliente/perfil" },
      { name: "Sorteios", path: "/cliente/sorteios" },
      { name: "Indicações", path: "/cliente/indicacoes" },
      { name: "Cashback", path: "/cliente/cashback" },
      { name: "Suporte", path: "/cliente/suporte" },
    ];

    test.each(sidebarLinks)(
      "renders $name link with correct path",
      ({ name, path }) => {
        const link = screen.getByRole("link", { name: new RegExp(name, "i") });
        expect(link).toHaveAttribute("href", path);
      }
    );

    it("displays user name correctly", () => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("has a working logout button", () => {
      const logoutButton = screen.getByText(/sair/i);
      expect(logoutButton).toBeInTheDocument();
    });
  });
});
