import fs from "fs";
import path from "path";

export interface BatchRecipient {
  email: string;
  name?: string;
}

export const BATCH_SIZE = 500;
export const RESEND_CHUNK_SIZE = 50;

const EMAILS_FILE_PATH = path.join(process.cwd(), "data", "emails.json");

function readEmailsFile(): BatchRecipient[] {
  const raw = fs.readFileSync(EMAILS_FILE_PATH, "utf-8");
  return JSON.parse(raw) as BatchRecipient[];
}

function writeEmailsFile(recipients: BatchRecipient[]): void {
  fs.writeFileSync(EMAILS_FILE_PATH, JSON.stringify(recipients, null, 2), "utf-8");
}

export function getAllRecipients(): BatchRecipient[] {
  return readEmailsFile();
}

export function getBatchRecipients(batchNumber: 1 | 2): BatchRecipient[] {
  const all = readEmailsFile();
  const start = (batchNumber - 1) * BATCH_SIZE;
  const end = start + BATCH_SIZE;
  return all.slice(start, end);
}

export function getTotalRecipients(): number {
  return readEmailsFile().length;
}

export function getBatchCount(): number {
  return Math.ceil(readEmailsFile().length / BATCH_SIZE);
}

export function addRecipient(recipient: BatchRecipient): BatchRecipient[] {
  const all = readEmailsFile();
  all.push(recipient);
  writeEmailsFile(all);
  return all;
}

export function updateRecipient(
  index: number,
  data: BatchRecipient
): BatchRecipient[] {
  const all = readEmailsFile();
  if (index < 0 || index >= all.length) {
    throw new Error("Recipient index out of bounds");
  }
  all[index] = data;
  writeEmailsFile(all);
  return all;
}

export function deleteRecipient(index: number): BatchRecipient[] {
  const all = readEmailsFile();
  if (index < 0 || index >= all.length) {
    throw new Error("Recipient index out of bounds");
  }
  all.splice(index, 1);
  writeEmailsFile(all);
  return all;
}
