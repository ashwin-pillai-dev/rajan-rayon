export interface requestParams {
    filters:Filter[];
    fullTextSearch:string;
    orderBy:string;
    page:number,
    limit:number
}

export interface Filter{
    field:string,
    cond:string,
    value:string
}

export interface getReqProps{
    query?:string
    page:string
    limit:string,
    filters?:Filter[]
  }
  export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total:number;
  }

