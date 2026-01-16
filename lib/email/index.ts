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


export async function sendSamplePropertiesEmail(to: string, listings: ListingWithRelations[]) {
  const html = generateSamplePropertiesEmailHtml(listings);

  return sendEmail({
    to,
    subject: `Eretz Realty - Featured Properties - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    html,
  });
}

function generateSamplePropertiesEmailHtml(listings: ListingWithRelations[]): string {
  // Use the shared table generator
  return generateListingsTableHtml(listings.slice(0, 5), "Featured Properties");
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
  return generateListingsTableHtml(listings, cycleName);
}

// Shared helper for Excel-like table format
function generateListingsTableHtml(listings: ListingWithRelations[], title: string): string {
  const rows = listings
    .map((listing, index) => {
      const isNew = listing.onMarket;
      // Notes: Zoning + Features
      const notesParts = [];
      if (listing.zoning) notesParts.push(listing.zoning.code);
      if (listing.features && listing.features.length > 0) {
        notesParts.push(listing.features.map(f => f.name).join(", "));
      }
      const notes = notesParts.join(", ");

      const rowStyle = "border-bottom: 1px solid #e0e0e0;";
      const cellStyle = "padding: 8px; font-size: 13px; color: #333; vertical-align: middle;";
      const centerStyle = "text-align: center;";
      
      return `
        <tr style="${rowStyle} background: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
          <td style="${cellStyle} ${centerStyle} font-weight: bold;">
            ${isNew ? '<span style="color: #2E7D32;">New</span> ' : ''}${listing.id}
          </td>
          <td style="${cellStyle}">${listing.locationDescription || '-'}</td>
          <td style="${cellStyle} ${centerStyle}">${listing.dimensions || '-'}</td>
          <td style="${cellStyle} ${centerStyle}">${listing.rooms || '-'}</td>
          <td style="${cellStyle} ${centerStyle}">${listing.squareFootage ? listing.squareFootage.toLocaleString() : '-'}</td>
          <td style="${cellStyle}">${listing.condition?.name || '-'}</td>
          <td style="${cellStyle}">${listing.propertyType?.name || '-'}</td>
          <td style="${cellStyle}">${notes}</td>
          <td style="${cellStyle} ${centerStyle} font-weight: bold; color: #000;">
            ${listing.price ? listing.price.toLocaleString() : '-'}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Calibri, Arial, sans-serif; margin: 0; padding: 20px; background: #ffffff; }
          table { border-collapse: collapse; width: 100%; border: 1px solid #ccc; }
          th { 
            background: #f0f0f0; 
            font-weight: bold; 
            padding: 10px; 
            font-size: 13px; 
            border-bottom: 2px solid #ccc; 
            text-align: center;
            color: #333; 
          }
          .text-left { text-align: left; }
        </style>
      </head>
      <body>
        <div style="font-family: Calibri, Arial, sans-serif; width: 100%; overflow-x: auto;">
          <h2 style="text-align: center; color: #2E7D32; font-size: 20px; margin-bottom: 20px;">${title}</h2>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="min-width: 800px;">
            <thead>
              <tr>
                <th style="width: 80px;">#</th>
                <th class="text-left">Location</th>
                <th>Dimensions</th>
                <th>Rooms</th>
                <th>Square footage</th>
                <th class="text-left">Condition</th>
                <th class="text-left">Other</th>
                <th class="text-left">Notes</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
            <p>Eretz Realty</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
