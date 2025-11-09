CREATE TABLE "categories_to_extensions" (
	"category_id" text NOT NULL,
	"extension_id" text NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_to_extensions_category_id_extension_id_pk" PRIMARY KEY("category_id","extension_id")
);
--> statement-breakpoint
CREATE TABLE "topics_to_extensions" (
	"topic_id" text NOT NULL,
	"extension_id" text NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topics_to_extensions_topic_id_extension_id_pk" PRIMARY KEY("topic_id","extension_id")
);
--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD CONSTRAINT "categories_to_extensions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories_to_extensions" ADD CONSTRAINT "categories_to_extensions_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD CONSTRAINT "topics_to_extensions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics_to_extensions" ADD CONSTRAINT "topics_to_extensions_extension_id_extensions_id_fk" FOREIGN KEY ("extension_id") REFERENCES "public"."extensions"("id") ON DELETE cascade ON UPDATE no action;