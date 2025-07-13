import { Test, TestingModule } from "@nestjs/testing";
import { OdooService } from "./odoo.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

describe("OdooService", () => {
  let service: OdooService;
  let configService: ConfigService;

  const mockOdooClient = {
    searchRead: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OdooService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case "ODOO_URL":
                  return "https://test.odoo.com";
                case "ODOO_DB":
                  return "test_db";
                case "ODOO_USERNAME":
                  return "test_user";
                case "ODOO_PASSWORD":
                  return "test_password";
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            form: {
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OdooService>(OdooService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock the OdooClient
    (service as any).client = mockOdooClient;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getSurveyLink", () => {
    it("should return survey link when survey exists", async () => {
      const mockSurvey = [
        {
          id: 123,
          title: "Test Survey",
          access_token: "test-token-123",
        },
      ];

      mockOdooClient.searchRead.mockResolvedValue(mockSurvey);

      const result = await service.getSurveyLink(123);

      expect(result).toEqual({
        surveyId: 123,
        surveyTitle: "Test Survey",
        surveyLink: "https://test.odoo.com/survey/start/test-token-123",
        accessToken: "test-token-123",
      });
    });

    it("should return error when survey not found", async () => {
      mockOdooClient.searchRead.mockResolvedValue([]);

      const result = await service.getSurveyLink(999);

      expect(result).toEqual({
        error: "Survey not found",
        surveyId: 999,
      });
    });

    it("should handle errors properly", async () => {
      const error = new Error("Connection failed");
      mockOdooClient.searchRead.mockRejectedValue(error);

      await expect(service.getSurveyLink(123)).rejects.toThrow(
        "Connection failed"
      );
    });
  });
});
