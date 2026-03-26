-- Migration: add_emailpreference_user_relation
-- Adds foreign key from email_preferences.userId to users.id with CASCADE delete.

-- AddForeignKey
ALTER TABLE "email_preferences" ADD CONSTRAINT "email_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
