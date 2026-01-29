CREATE TABLE `email_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`intro_text` text DEFAULT 'please review,
Feel free to call for more details.
please reply listing number for more details

Thanks,
Duvid Rubin' NOT NULL,
	`agent_title` text DEFAULT 'Licensed Real Estate Agent' NOT NULL,
	`agent_name` text DEFAULT 'David Rubin' NOT NULL,
	`company_name` text DEFAULT 'Eretz realty' NOT NULL,
	`agent_address` text DEFAULT '5916 18th Ave' NOT NULL,
	`agent_city_state_zip` text DEFAULT 'Brooklyn, N.Y. 11204' NOT NULL,
	`agent_phone_1` text DEFAULT 'C-917.930.2028' NOT NULL,
	`agent_phone_2` text DEFAULT '718.256.9595 X 209' NOT NULL,
	`agent_email` text DEFAULT 'drubin@eretzltd.com' NOT NULL,
	`legal_disclaimer` text DEFAULT 'IMPORTANT NOTICE: This message and any attachments are solely for the intended recipient and may contain confidential information which is, or may be, legally privileged or otherwise protected by law from further disclosure. If you are not the intended recipient, any disclosure, copying, use, or distribution of the information included in this e-mail and any attachments is prohibited. If you have received this communication in error, please notify the sender by reply e-mail and immediately and permanently delete this e-mail and any attachments.' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
