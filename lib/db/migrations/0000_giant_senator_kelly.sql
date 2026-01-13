CREATE TABLE `conditions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `conditions_name_unique` ON `conditions` (`name`);--> statement-breakpoint
CREATE TABLE `cycle_schedules` (
	`week_number` integer PRIMARY KEY NOT NULL,
	`day_of_month` integer NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `features_name_unique` ON `features` (`name`);--> statement-breakpoint
CREATE TABLE `listing_features` (
	`listing_id` integer NOT NULL,
	`feature_id` integer NOT NULL,
	FOREIGN KEY (`listing_id`) REFERENCES `listings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`feature_id`) REFERENCES `features`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL,
	`location_description` text,
	`dimensions` text,
	`rooms` integer,
	`square_footage` integer,
	`price` integer,
	`on_market` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`cycle_group` integer NOT NULL,
	`property_type_id` integer,
	`condition_id` integer,
	`zoning_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`cycle_group`) REFERENCES `cycle_schedules`(`week_number`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_type_id`) REFERENCES `property_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`condition_id`) REFERENCES `conditions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`zoning_id`) REFERENCES `zonings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `property_types_name_unique` ON `property_types` (`name`);--> statement-breakpoint
CREATE TABLE `zonings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `zonings_code_unique` ON `zonings` (`code`);