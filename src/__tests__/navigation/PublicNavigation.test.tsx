
import { render, screen, fireEvent } from "@/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/Header";

describe("Public Navigation", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  });

  const publicLinks = [
    { name: "Como Funciona", id: "como-funciona" },
    { name: "Benefícios", id: "beneficios" },
    { name: "Depoimentos", id: "depoimentos" },
    { name: "FAQ", id: "faq" },
    { name: "Blog", path: "/blog" },
  ];

  test.each(publicLinks)(
    "renders $name navigation item",
    ({ name }) => {
      const linkElement = screen.getByText(new RegExp(name, "i"));
      expect(linkElement).toBeInTheDocument();
    }
  );

  it("renders logo that links to home", () => {
    const logo = screen.getByText(/premiads/i);
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("toggles mobile menu when menu button is clicked", () => {
    // Only visible on mobile
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Check if mobile menu items are visible
    publicLinks.forEach(({ name }) => {
      const menuItem = screen.getByText(new RegExp(name, "i"));
      expect(menuItem).toBeVisible();
    });
  });

  it("renders user type selector", () => {
    const participanteButton = screen.getByRole("button", { name: /participante/i });
    const anuncianteButton = screen.getByRole("button", { name: /anunciante/i });
    
    expect(participanteButton).toBeInTheDocument();
    expect(anuncianteButton).toBeInTheDocument();
  });
});
