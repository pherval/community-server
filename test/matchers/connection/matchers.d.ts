/// <reference types="jest" />
/// <reference types="modules/connection/types" />

declare namespace jest {
	interface Matchers<R> {
		toHaveNextPage(): R;
		toMatchPageInfo(pageInfo: Partial<PageInfo>): R;
	}
}