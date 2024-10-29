export interface Author {
  PK: string;
  SK: string;
  id: string;
  name: string;
  surename: string;
  creatadAt: string;
  updatedAt: string;
}

export interface CreateAuthorDto {
  name: string;
  surname: string;
}
