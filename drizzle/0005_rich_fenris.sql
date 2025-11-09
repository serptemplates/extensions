ALTER TABLE "extensions" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "extensions" ADD CONSTRAINT "extensions_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extensions" DROP COLUMN "is_new";