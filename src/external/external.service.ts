import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExternalService {
  constructor(private prisma: PrismaService) {}

  async getAggregatedResults(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { apiToken: token },
    });
    if (!user) throw new UnauthorizedException('Invalid API token');

    const forms = await this.prisma.form.findMany({
      where: { authorId: user.id, isDeleted: false },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    return forms.map((form) => ({
      id: form.id,
      title: form.title,
      questions: form.questions.map((question) => {
        const answers = question.answers;

        if (question.type === 'number') {
          const nums = answers
            .map((a) => Number(a.textAnswer))
            .filter((n) => !isNaN(n));

          const count = nums.length;
          const average = count
            ? nums.reduce((a, b) => a + b, 0) / count
            : null;
          const min = count ? Math.min(...nums) : null;
          const max = count ? Math.max(...nums) : null;

          return {
            text: question.title,
            type: question.type,
            count,
            average,
            min,
            max,
          };
        } else {
          const freq: Record<string, number> = {};
          for (const answer of answers) {
            const text = answer.textAnswer || '';
            if (text) freq[text] = (freq[text] || 0) + 1;
          }

          const count = answers.length;
          const topAnswers = Object.entries(freq)
            .sort(([, aCount], [, bCount]) => bCount - aCount)
            .slice(0, 3)
            .map(([val]) => val);

          return {
            text: question.title,
            type: question.type,
            count,
            topAnswers,
          };
        }
      }),
    }));
  }
}
