import { Resend } from "resend";
import { ListingWithRelations } from "@/lib/db/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email (you can customize this)
const FROM_EMAIL = "Eretz Realty <noreply@angelvalladares.dev>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendTestEmail(to: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f5f5f5; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Eretz Realty</h1>
            <p>Test Email</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>This is a test email from Eretz Realty.</p>
            <p>If you received this, your email configuration is working correctly!</p>
            <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eretz Realty. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Eretz Realty - Test Email",
    html,
    text: "This is a test email from Eretz Realty.",
  });
}

export interface PropertyEmailOptions {
  cycleNumber: 1 | 2 | 3;
  listings: ListingWithRelations[];
  cycleName: string;
}

export async function sendPropertyEmail(
  to: string | string[],
  { cycleNumber, listings, cycleName }: PropertyEmailOptions
) {
  const html = generatePropertyEmailHtml(cycleNumber, listings, cycleName);

  return sendEmail({
    to,
    subject: `Eretz Realty - ${cycleName} - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    html,
  });
}

function generatePropertyEmailHtml(
  cycleNumber: 1 | 2 | 3,
  listings: ListingWithRelations[],
  cycleName: string
): string {
  const listingsHtml = listings
    .map((listing) => {
      const badges = [];
      if (listing.onMarket) badges.push('<span style="background: #2E7D32; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">NEW</span>');

      return `
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <h3 style="margin: 0; color: #2E7D32; font-size: 18px;">${listing.address}</h3>
            <div style="display: flex; gap: 4px;">${badges.join("")}</div>
          </div>
          ${listing.locationDescription ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">${listing.locationDescription}</p>` : ""}
          ${listing.dimensions ? `<p style="margin: 4px 0; color: #666; font-size: 14px;">Lot: ${listing.dimensions}</p>` : ""}
          <div style="display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap;">
            ${listing.rooms ? `<span style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 13px;">${listing.rooms} Rooms</span>` : ""}
            ${listing.squareFootage ? `<span style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 13px;">${listing.squareFootage.toLocaleString()} sqft</span>` : ""}
            ${listing.price ? `<span style="background: #2E7D32; color: white; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: bold;">$${listing.price.toLocaleString()}</span>` : ""}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;">
            ${listing.propertyType ? `<span style="color: #666; font-size: 12px;">Type: ${listing.propertyType.name}</span>` : ""}
            ${listing.condition ? `<span style="color: #666; font-size: 12px;">Condition: ${listing.condition.name}</span>` : ""}
            ${listing.zoning ? `<span style="color: #666; font-size: 12px;">Zoning: ${listing.zoning.code}</span>` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 8px 0 0 0; opacity: 0.9; }
          .content { padding: 30px; background: #f9f9f9; }
          .cycle-badge { display: inline-block; background: white; color: #2E7D32; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-top: 16px; }
          .stats { display: flex; gap: 20px; justify-content: center; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #2E7D32; }
          .stat-label { font-size: 12px; color: #666; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
          .footer a { color: #4CAF50; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Eretz Realty</h1>
            <p>Exclusive Property Listings</p>
            <span class="cycle-badge">${cycleName}</span>
          </div>

          <div class="content">
            <div class="stats">
              <div class="stat">
                <div class="stat-value">${listings.length}</div>
                <div class="stat-label">Properties</div>
              </div>
              <div class="stat">
                <div class="stat-value">${listings.filter((l) => l.onMarket).length}</div>
                <div class="stat-label">New Listings</div>
              </div>
              <div class="stat">
                <div class="stat-value">${cycleNumber}</div>
                <div class="stat-label">Cycle</div>
              </div>
            </div>

            ${listingsHtml}
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eretz Realty. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
