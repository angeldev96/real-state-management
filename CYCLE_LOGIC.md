# Cycle Logic (Non-Technical Guide)

This document explains the **weekly cycle system** in plain English. It is written for non-programmers.

---

## 1) What is a “Cycle”?
A **cycle** is just a numbered batch of listings:
- **Cycle 1**
- **Cycle 2**
- **Cycle 3**

Each cycle is sent **once per week**, always in order:

**1 → 2 → 3 → 1 → 2 → 3 → ...**

So even if someone calls it “Week 1 / Week 2 / Week 3,” it is really just **Cycle 1, Cycle 2, Cycle 3** repeating every Wednesday (or any chosen day).

---

## 2) How the Rotation Works
Every week on the chosen day (default is **Wednesday**):
1. The system checks which cycle is next.
2. It sends **that cycle’s listings** to the email list.
3. It moves to the next cycle number for the following week.

Example timeline:
- **Wed #1:** Cycle 1
- **Wed #2:** Cycle 2
- **Wed #3:** Cycle 3
- **Wed #4:** Cycle 1 again

---

## 3) Where to Configure It
Go to **Settings → Cycle Rotation Schedule**.

There you can set:
- **Day of week** (e.g., Wednesday)
- **Time** (hour + minute)

The page also shows:
- **Current Cycle** (what will send next)
- **Next Send Date**
- The rotation order (1 → 2 → 3 → 1)

---

## 4) Who Receives the Emails?
Emails are only sent to **active recipients** in the **Email Distribution List**.
You can:
- Add new emails
- Deactivate an email without deleting it
- Reactivate any email later

---

## 5) What Gets Sent?
The system sends listings **only for the current cycle**. Listings are already tagged with a cycle number (1, 2, or 3).

---

## 6) How the System Triggers Sends
There is a backend endpoint that handles the send:

- **POST /api/cycle/rotate**

This endpoint:
- Sends the current cycle’s listings
- Logs the send
- Advances to the next cycle

### Production Setup (Vercel Cron)
If you use **Vercel Cron**, add a `vercel.json` file with a weekly schedule
and Vercel will call the endpoint automatically.

Example (runs every 5 minutes to match the exact configured time):

```
{
	"crons": [
		{
			"path": "/api/cycle/rotate",
			"schedule": "*/5 * * * *"
		}
	]
}
```

> Note: The endpoint will only send when the **New York time** matches your configured day/time.

### Production Setup (Secret Header)
The endpoint is protected by a secret header:

- Set an environment variable: `CYCLE_ROTATION_SECRET`
- Your scheduler must call the endpoint with header: `x-cron-secret: <your-secret>`

Example (cron / scheduler request):

```
POST https://your-domain.com/api/cycle/rotate
x-cron-secret: <your-secret>
```

---

## 7) Quick Checklist
✅ Cycle day is correct
✅ Time is correct
✅ Active recipients exist
✅ Listings are tagged with a cycle (1, 2, or 3)

---

## 8) If Nothing Sends
Common reasons:
- No active recipients
- No listings in that cycle
- Scheduler not calling the endpoint

---

## 9) Summary (One Sentence)
Every week on the chosen day, the system sends **Cycle 1**, then **Cycle 2**, then **Cycle 3**, and repeats forever.
