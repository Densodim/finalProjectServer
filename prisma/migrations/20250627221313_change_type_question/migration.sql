/*
  Warnings:

  - The values [SHORT_TEXT,LONG_TEXT,MULTIPLE_CHOICE,CHECKBOXES,BROPDOWN,FILE_UPLOAD,EMAIL,NUMBER] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('text', 'comment', 'radiogroup', 'checkbox', 'email', 'number', 'file');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;
