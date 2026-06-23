CREATE TABLE place_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT place_ratings_seller_profile_id_fkey
    FOREIGN KEY (seller_profile_id)
    REFERENCES seller_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT place_ratings_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX place_ratings_seller_profile_id_user_id_key
  ON place_ratings(seller_profile_id, user_id);

CREATE INDEX place_ratings_seller_profile_id_score_idx
  ON place_ratings(seller_profile_id, score);

CREATE INDEX place_ratings_user_id_idx
  ON place_ratings(user_id);
