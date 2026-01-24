export interface Chirp {
  id: string;
  body: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChirpInput {
  body: string;
}

export type SortOrder = 'asc' | 'desc';

export interface GetChirpsFilter {
  authorId?: string;
  sort?: SortOrder;
}
