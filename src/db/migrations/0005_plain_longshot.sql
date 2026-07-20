CREATE INDEX "eco_places_created_by_idx" ON "eco_places" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "products_seller_id_idx" ON "products" USING btree ("seller_id");