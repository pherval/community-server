import { Types } from "mongoose";

export type Avatar = string;
export type Cursor = Date;

export type Connection<T> = {
	edges: EdgeConnection<T>;
	pageInfo: PageInfo;
};

export type PageInfo = {
	startCursor: Cursor;
	endCursor: Cursor;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
};

export type EdgeConnection<T> = Edge<T>[];

export type Edge<T> = {
	cursor: Cursor;
	node: T;
};

export type Node<T> = T & {
	id: Types.ObjectId;
};

export type ForwardPagination = {
	first: number;
	after: Cursor;
};

export type BackwardPagination = {
	last: number;
	before: Cursor;
};

export type PageArgs<
	T extends ForwardPagination | BackwardPagination = ForwardPagination
> = {
	page?: Partial<T>;
};
