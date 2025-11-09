CREATE TABLE "developers" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"website" text,
	"github_url" text,
	"twitter_url" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "developers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "extensions" ADD COLUMN "developer_id" text;--> statement-breakpoint
ALTER TABLE "extensions" ADD CONSTRAINT "extensions_developer_id_developers_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developers"("id") ON DELETE no action ON UPDATE no action;