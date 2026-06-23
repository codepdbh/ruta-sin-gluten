ALTER TABLE "users"
  ADD COLUMN "password_reset_token_hash" TEXT,
  ADD COLUMN "password_reset_token_expires_at" TIMESTAMP(3);

CREATE INDEX "users_password_reset_token_hash_idx"
  ON "users"("password_reset_token_hash");
