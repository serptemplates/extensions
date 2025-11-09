ALTER TABLE "categories_to_extensions" ADD COLUMN "stripe_product_id" text;--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD COLUMN "stripe_price_id" text;--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD COLUMN "is_sponsored" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD COLUMN "sponsored_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD COLUMN "stripe_product_id" text;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD COLUMN "stripe_price_id" text;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD COLUMN "is_sponsored" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD COLUMN "sponsored_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;