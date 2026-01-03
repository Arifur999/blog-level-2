import { string } from "better-auth/*";
import e from "express";

type IOptions = {
  page?: number |string;
  limit?: number |string;
  SORT?: string ;
  order?: string;

};


type IOptionsResult = {
  page: number;
  limit: number; 
  sort: string ;
  order: string;
  skip: number;
};


const paginationSortingHelper = (option: IOptions): IOptionsResult => {
  const page = Number(option.page ?? 1);
  const limit = Number(option.limit ?? 10);
  const sort = String(option.SORT ?? "createdAt");
  const order = String(option.order ?? "desc");
  const skip = (page - 1) * limit;  

    return { page, limit, sort, order, skip };
};
export { paginationSortingHelper };