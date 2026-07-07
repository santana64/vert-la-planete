CREATE TYPE "public"."place_kind" AS ENUM('ramassage', 'dechetterie', 'centre');--> statement-breakpoint
CREATE TABLE "eco_places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "place_kind" NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"city" text NOT NULL,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"schedule" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "lat" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers" ADD COLUMN "lng" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "eco_places" ADD CONSTRAINT "eco_places_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;