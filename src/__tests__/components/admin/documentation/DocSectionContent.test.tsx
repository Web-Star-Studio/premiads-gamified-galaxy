
import { render, screen } from "@/utils/test-utils";
import DocSectionContent from "@/components/admin/documentation/DocSectionContent";
import * as ContentComponents from "@/components/admin/documentation/content";

// Mock all content components to avoid rendering actual content
jest.mock("@/components/admin/documentation/content", () => ({
  OverviewContent: () => <div data-testid="overview-content">Overview Content</div>,
  DashboardContent: () => <div data-testid="dashboard-content">Dashboard Content</div>,
  UsersContent: () => <div data-testid="users-content">Users Content</div>,
  AccessContent: () => <div data-testid="access-content">Access Content</div>,
  RulesContent: () => <div data-testid="rules-content">Rules Content</div>,
  MonitoringContent: () => <div data-testid="monitoring-content">Monitoring Content</div>,
  ReportsContent: () => <div data-testid="reports-content">Reports Content</div>,
  RafflesContent: () => <div data-testid="raffles-content">Raffles Content</div>,
  NotificationsContent: () => <div data-testid="notifications-content">Notifications Content</div>,
  SettingsContent: () => <div data-testid="settings-content">Settings Content</div>,
  DatabaseContent: () => <div data-testid="database-content">Database Content</div>,
  FaqContent: () => <div data-testid="faq-content">FAQ Content</div>
}));

describe("DocSectionContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders empty state when no section ID provided", () => {
    render(<DocSectionContent sectionId="" />);
    
    expect(screen.getByText("Selecione uma seção da documentação para visualizar o conteúdo"))
      .toBeInTheDocument();
  });

  test("renders overview content when section is 'overview'", () => {
    render(<DocSectionContent sectionId="overview" />);
    
    expect(screen.getByTestId("overview-content")).toBeInTheDocument();
  });

  test("renders dashboard content when section is 'dashboard'", () => {
    render(<DocSectionContent sectionId="dashboard" />);
    
    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
  });

  test("renders users content when section is 'users'", () => {
    render(<DocSectionContent sectionId="users" />);
    
    expect(screen.getByTestId("users-content")).toBeInTheDocument();
  });

  test("renders not found message for invalid section ID", () => {
    render(<DocSectionContent sectionId="invalid-section" />);
    
    expect(screen.getByText("Nenhum conteúdo encontrado para a seção \"invalid-section\""))
      .toBeInTheDocument();
  });
});
