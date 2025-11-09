ALTER TABLE "extensions" ADD COLUMN "short_description" varchar(75);--> statement-breakpoint
ALTER TABLE "extensions" ADD COLUMN "edge_store_url" text;--> statement-breakpoint
ALTER TABLE "extensions" ADD COLUMN "opera_store_url" text;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "ahrefs_sv";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "ahrefs_kd";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "ahrefs_tp";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "ahrefs_gsv";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "ahrefs_gtp";--> statement-breakpoint
ALTER TABLE "topics_to_extensions" DROP COLUMN "sponsored_until";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_name_unique" UNIQUE("name");