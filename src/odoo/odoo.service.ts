import { Injectable } from "@nestjs/common";
import { OdooAuthenticationError, OdooClient, OdooError } from "odoo-xmlrpc-ts";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { DropboxService } from "../dropbox/dropbox.service";

@Injectable()
export class OdooService {
  private client: OdooClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly dropboxService: DropboxService
  ) {
    this.client = new OdooClient({
      url: this.configService.get<string>("ODOO_URL") || "",
      db: this.configService.get<string>("ODOO_DB") || "",
      username: this.configService.get<string>("ODOO_USERNAME") || "",
      password: this.configService.get<string>("ODOO_PASSWORD") || "",
    });
  }

  private handleError(error: any) {
    if (error instanceof OdooAuthenticationError) {
      console.error("Auth failed:", error.message);
    } else if (error instanceof OdooError) {
      console.error("Odoo error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }

  async getSurveys() {
    try {
      return await this.client.searchRead("survey.survey", [], {
        fields: ["id", "title", "description"],
        limit: 20,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSurveyQuestions(surveyId: number) {
    try {
      const questions = await this.client.searchRead(
        "survey.question",
        [["survey_id", "=", surveyId]],
        {
          fields: ["id", "title", "question_type", "sequence"],
          order: "sequence",
        }
      );
      return {
        surveyId: Number(surveyId),
        questions: questions.map((q: any) => ({
          id: q.id,
          title: q.title,
          type: q.question_type,
          order: q.sequence,
        })),
      };
    } catch (error) {
      console.error("Error getting questions:", error);
      this.handleError(error);
    }
  }

  async getSurveyDetails(surveyId: number) {
    try {
      const survey = await this.client.searchRead(
        "survey.survey",
        [["id", "=", surveyId]],
        {
          fields: ["id", "title", "description", "user_id", "create_date"],
        }
      );

      if (!survey || survey.length === 0) {
        return {
          error: "Survey not found",
          surveyId: Number(surveyId),
        };
      }

      return {
        surveyId: Number(surveyId),
        survey: survey[0],
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async importFromOdooToLocal(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const odooTemplates = await this.client.searchRead("survey.survey", [], {
        fields: [
          "id",
          "title",
          "description",
          "user_id",
          "create_date",
          "write_date",
        ],
      });

      const importedForms: Array<{
        id: number;
        title: string;
        questionsCount: number;
        odooId: any;
      }> = [];

      for (const odooTemplate of odooTemplates as any[]) {
        const existingForm = await this.prisma.form.findFirst({
          where: {
            title: odooTemplate.title,
            authorId: userId,
          },
        });

        if (!existingForm) {
          const newForm = await this.prisma.form.create({
            data: {
              title: odooTemplate.title,
              description: `Imported from Odoo (ID: ${odooTemplate.id})`,
              authorId: userId,
              isPublished: true,
            },
          });

          const odooQuestions = await this.client.searchRead(
            "survey.question",
            [["survey_id", "=", odooTemplate.id]],
            {
              fields: ["id", "title", "question_type", "sequence"],
            }
          );

          for (const odooQuestion of odooQuestions as any[]) {
            await this.prisma.question.create({
              data: {
                title: odooQuestion.title,
                type: this.mapOdooQuestionType(
                  odooQuestion.question_type
                ) as any,
                isRequired: false,
                order: odooQuestion.sequence || 1,
                formId: newForm.id,
              },
            });
          }

          importedForms.push({
            id: newForm.id,
            title: newForm.title,
            questionsCount: odooQuestions.length,
            odooId: odooTemplate.id,
          });
        }
      }

      return {
        importedCount: importedForms.length,
        forms: importedForms,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private mapOdooQuestionType(odooType: string): string {
    const typeMapping: { [key: string]: string } = {
      text: "text",
      comment: "comment",
      radiogroup: "radiogroup",
      checkbox: "checkbox",
      email: "email",
      number: "number",
      file: "file",
    };

    return typeMapping[odooType] || "text";
  }

  async exportFormToOdoo(formId: number) {
    try {
      const form = await this.prisma.form.findUnique({
        where: { id: formId },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!form) {
        throw new Error(`Form with ID ${formId} not found`);
      }

      const surveyData = {
        title: form.title,
        description:
          form.description || `Exported from local system (ID: ${form.id})`,
        user_id: 1,
      };

      const odooSurveyId = await this.client.create(
        "survey.survey",
        surveyData
      );

      for (const question of form.questions) {
        try {
          const questionData = {
            survey_id: odooSurveyId,
            title: question.title,
            question_type: this.mapLocalQuestionType(question.type),
            sequence: question.order,
          };

          await this.client.create("survey.question", questionData);
        } catch (error) {
          console.log(
            `Failed to create question with question_type, trying without it...`
          );

          const questionData = {
            survey_id: odooSurveyId,
            title: question.title,
            sequence: question.order,
          };

          await this.client.create("survey.question", questionData);
        }
      }

      return {
        odooSurveyId,
        message: "Form successfully created in Odoo",
        formTitle: form.title,
        questionsCount: form.questions.length,
        surveyLink: `${
          this.configService.get<string>("ODOO_URL") || ""
        }/survey/start/${odooSurveyId}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private mapLocalQuestionType(localType: string): string {
    const typeMapping: { [key: string]: string } = {
      text: "char_box",
      comment: "text_box",
      radiogroup: "simple_choice",
      checkbox: "multiple_choice",
      email: "char_box",
      number: "numerical_box",
      file: "char_box",
    };
    return typeMapping[localType] || "char_box";
  }

  async getSurveyLink(surveyId: number) {
    try {
      const survey = await this.client.searchRead(
        "survey.survey",
        [["id", "=", surveyId]],
        {
          fields: ["id", "title", "access_token"],
        }
      );

      if (!survey || survey.length === 0) {
        return {
          error: "Survey not found",
          surveyId: Number(surveyId),
        };
      }

      const surveyData = survey[0] as any;
      const odooUrl = this.configService.get<string>("ODOO_URL") || "";

      const surveyLink = `${odooUrl}/survey/start/${surveyData.access_token}`;

      return {
        surveyId: Number(surveyId),
        surveyTitle: surveyData.title,
        surveyLink: surveyLink,
        accessToken: surveyData.access_token,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSurveyResponses(surveyId: number) {
    try {
      const userInputs = await this.client.searchRead(
        "survey.user_input",
        [["survey_id", "=", surveyId]],
        {
          fields: ["id", "survey_id", "state", "create_date", "partner_id"],
          limit: 10,
        }
      );

      const responses: Array<{ userInput: any; answers: any[] }> = [];
      for (const input of userInputs as any[]) {
        const answers = await this.client.searchRead(
          "survey.user_input.line",
          [["user_input_id", "=", input.id]],
          {
            fields: ["id", "question_id"],
          }
        );
        responses.push({
          userInput: input,
          answers,
        });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `survey-${surveyId}-responses-${timestamp}.json`;
      const dropboxResult = await this.dropboxService.uploadJson(
        filename,
        responses
      );

      return { responses, dropbox: dropboxResult };
    } catch (error) {
      this.handleError(error);
    }
  }
}
