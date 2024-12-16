type TokenLimit = 5000 | 30000;

export type CreateTokenLimit = {
  user_id: string;
  token_limit?: TokenLimit;
};

export type UpdateTokenLimit = CreateTokenLimit & {
  tokens_used: number;
};
