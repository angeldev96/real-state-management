CREATE TABLE `cycle_rotation_config` (
	`id` integer PRIMARY KEY NOT NULL,
	`day_of_week` integer NOT NULL,
	`send_hour` integer DEFAULT 0 NOT NULL,
	`send_minute` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cycle_rotation_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`current_cycle` integer DEFAULT 1 NOT NULL,
	`last_run_at` integer,
	`next_run_at` integer,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cycle_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cycle_number` integer NOT NULL,
	`scheduled_for` integer NOT NULL,
	`sent_at` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`error` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
