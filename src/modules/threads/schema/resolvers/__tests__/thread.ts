import type { GraphQLResolveInfo } from "graphql";
import { ThreadFactory, PostFactory } from "factory";
import { databaseSetup } from "utils";
import { PostModel, PostDocument } from "modules/post";
import { post, participants } from "../thread";

databaseSetup();

describe("Thread Type resolvers", () => {
	test("post resolve return thread's original post document", async () => {
		const op = await PostFactory.create();
		const thread = await ThreadFactory.create(
			{},
			{ associations: { op: op._id } }
		);

		const result = await post(thread, null, null, {} as GraphQLResolveInfo);

		expect(result).toBeInstanceOf(PostModel);
		expect(result._id).toStrictEqual(op._id);
	});

	describe("participants resolver", () => {
		test("no interactions when thread has no reply", async () => {
			const thread = await ThreadFactory.create();
			const result = await participants(
				thread,
				{},
				null,
				{} as GraphQLResolveInfo
			);

			expect(result.interactions).toBeEmpty();
			expect(result.page).toBeEmpty();
		});

		test("original post direct replies", async () => {
			const thread = await ThreadFactory.create(
				{},
				{ transient: { replies: 5 } }
			);

			const result = await participants(
				thread,
				{},
				null,
				{} as GraphQLResolveInfo
			);

			const doc = await thread.populate<{ op: PostDocument }>("op");
			const posts = doc.op.children;

			expect(result.interactions).toMatchObject(posts);
			expect(result.page).toMatchObject(posts);
		});

		test("all deeply nested replies", async () => {
			const reply3 = await PostFactory.create();
			const reply2 = await PostFactory.create(
				{},
				{ associations: { children: [reply3._id] } }
			);
			const reply1 = await PostFactory.create(
				{},
				{ associations: { children: [reply2._id] } }
			);

			const op = await PostFactory.create(
				{},
				{ associations: { children: [reply1._id] } }
			);

			const thread = await ThreadFactory.create(
				{},
				{ associations: { op: op._id } }
			);

			const result = await participants(
				thread,
				{},
				null,
				{} as GraphQLResolveInfo
			);

			const posts = [reply1._id, reply2._id, reply3._id];

			expect(result.interactions).toMatchObject(posts);
			expect(result.page).toMatchObject(posts);
		});

		test.todo("paginate participants by post's update date");
	});
});
