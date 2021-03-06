import { model, Schema, Types, HydratedDocument } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import type { Timestamps } from "./types";
import { arrayUniqueness } from "./validators";

export interface Post extends Timestamps {
	message?: string;
	likes: number;
	author: Types.ObjectId;
	likedBy: Types.ObjectId[]; // TODO: verificar uma forma de representar isso
	children: Types.ObjectId[]; // TODO: por ser uma árvore, validar por ciclos
}

const postSchema = new Schema<Post>(
	{
		message: {
			type: String,
			maxLength: 10_000,
		},

		author: {
			type: "ObjectId",
			ref: "User",
			required: true,
			immutable: true,
			autopopulate: true,
		},

		likedBy: {
			type: [{ type: "ObjectId", ref: "User" }],
			validate: arrayUniqueness.validate,
		},
		children: [{ type: "ObjectId", ref: "Post" }],
	},
	{ timestamps: true }
);

postSchema.index({ updatedAt: -1 });

postSchema.virtual("likes").get(function (this: Post) {
	return this.likedBy.length;
});

postSchema.plugin(mongooseAutoPopulate);

export type PostDocument = HydratedDocument<Post>;

export const PostModel = model<Post>("Post", postSchema);
