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
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eretz Realty - Test Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; border-collapse: collapse;">
          <tr>
            <td style="background-color: #2E7D32; color: #ffffff; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Eretz Realty</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Test Email</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; background-color: #f5f5f5;">
              <p style="margin: 0 0 15px 0;">Hello!</p>
              <p style="margin: 0 0 15px 0;">This is a test email from Eretz Realty.</p>
              <p style="margin: 0 0 15px 0;">If you received this, your email configuration is working correctly!</p>
              <p style="margin: 0;"><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px; font-size: 12px; color: #666666;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Eretz Realty. All rights reserved.</p>
            </td>
          </tr>
        </table>
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
  const cellStyle = "padding: 8px; font-size: 13px; color: #333333; vertical-align: middle; border: 1px solid #cccccc;";
  const headerStyle = "background-color: #f0f0f0; font-weight: bold; padding: 10px; font-size: 13px; border: 1px solid #cccccc; color: #333333; text-align: center;";
  const titleStyle = "text-align: center; color: #2E7D32; font-size: 20px; margin-bottom: 20px; font-family: Arial, sans-serif;";
  
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

      const bgColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      
      return `
        <tr bgcolor="${bgColor}">
          <td align="center" style="${cellStyle} font-weight: bold;">
            ${isNew ? '<span style="color: #2E7D32;">New</span> ' : ''}${listing.id}
          </td>
          <td align="left" style="${cellStyle}">${listing.locationDescription || '-'}</td>
          <td align="center" style="${cellStyle}">${listing.dimensions || '-'}</td>
          <td align="center" style="${cellStyle}">${listing.rooms || '-'}</td>
          <td align="center" style="${cellStyle}">${listing.squareFootage ? listing.squareFootage.toLocaleString() : '-'}</td>
          <td align="left" style="${cellStyle}">${listing.condition?.name || '-'}</td>
          <td align="left" style="${cellStyle}">${listing.propertyType?.name || '-'}</td>
          <td align="left" style="${cellStyle}">${notes}</td>
          <td align="center" style="${cellStyle} font-weight: bold; color: #000000;">
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
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #ffffff;">
        <div style="width: 100%; max-width: 1000px; margin: 0 auto;">
          <h2 style="${titleStyle}">${title}</h2>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="1" style="border-collapse: collapse; border: 1px solid #cccccc; min-width: 800px;">
            <thead>
              <tr bgcolor="#f0f0f0">
                <th style="${headerStyle} width: 60px;">#</th>
                <th style="${headerStyle} text-align: left;">Location</th>
                <th style="${headerStyle}">Dimensions</th>
                <th style="${headerStyle}">Rooms</th>
                <th style="${headerStyle}">Sq. Ft.</th>
                <th style="${headerStyle} text-align: left;">Condition</th>
                <th style="${headerStyle} text-align: left;">Type</th>
                <th style="${headerStyle} text-align: left;">Notes</th>
                <th style="${headerStyle}">Price</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666666; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Eretz Realty</p>
            <p style="margin: 5px 0 0 0;">This is an automated property update.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
