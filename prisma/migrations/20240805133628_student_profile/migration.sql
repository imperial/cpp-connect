-- CreateTable
CREATE TABLE "StudentProfile" (
    "userId" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "personalWebsite" TEXT,
    "github" TEXT,
    "linkedIn" TEXT,
    "course" TEXT NOT NULL,
    "graduatingDate" TEXT NOT NULL,
    "cv" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
