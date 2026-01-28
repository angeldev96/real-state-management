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
  return generateListingsGridHtml(listings, "Featured Properties");
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

export function generatePropertyEmailHtml(
  cycleNumber: 1 | 2 | 3,
  listings: ListingWithRelations[],
  cycleName: string
): string {
  return generateListingsGridHtml(listings, cycleName);
}

// Helper to group listings by property type
function groupListingsByType(listings: ListingWithRelations[]) {
  const groups: Record<string, ListingWithRelations[]> = {};
  listings.forEach(listing => {
    const typeName = listing.propertyType?.name || "Other";
    if (!groups[typeName]) {
      groups[typeName] = [];
    }
    groups[typeName].push(listing);
  });
  return groups;
}

// Modern email table with zebra stripes AND type grouping headers
function generateListingsGridHtml(listings: ListingWithRelations[], title: string): string {
  const groups = groupListingsByType(listings);
  const sortedTypes = Object.keys(groups).sort();

  // Header styles - elegant, bold typography
  const headerCellStyle = "padding: 12px 14px; font-weight: 700; font-size: 13px; color: #2c2c2c; background-color: #f0f0f0; border-bottom: 2px solid #ddd; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Georgia', 'Times New Roman', serif;";

  const tableHeader = `
    <tr>
      <th style="${headerCellStyle} text-align: center; width: 80px;">#</th>
      <th style="${headerCellStyle} text-align: left;">Location</th>
      <th style="${headerCellStyle} text-align: center;">Dimensions</th>
      <th style="${headerCellStyle} text-align: center; width: 65px;">Rooms</th>
      <th style="${headerCellStyle} text-align: center;">Square footage</th>
      <th style="${headerCellStyle} text-align: center;">Condition</th>
      <th style="${headerCellStyle} text-align: center;">Other</th>
      <th style="${headerCellStyle} text-align: center; width: 70px;">Notes</th>
      <th style="${headerCellStyle} text-align: right; width: 90px;">Price</th>
    </tr>
  `;

  let tablesHtml = "";

  for (const type of sortedTypes) {
    const typeListings = groups[type];
    let rowsHtml = "";

    typeListings.forEach((listing, index) => {
      // "New" label in green
      const isNew = listing.onMarket;
      const idDisplay = isNew
        ? `<span style="color: #2E7D32; font-weight: bold;">New</span> ${listing.id}`
        : `${listing.id}`;

      const location = listing.locationDescription || listing.address || '-';
      const dimensions = listing.dimensions || '-';
      const rooms = listing.rooms || '-';
      const sqFt = listing.squareFootage ? listing.squareFootage.toLocaleString() : '-';
      const condition = listing.condition?.name || '-';

      // Other -> Features
      const other = listing.features && listing.features.length > 0
        ? listing.features.map(f => f.name).join(", ")
        : '-';

      // Notes -> Zoning
      const notes = listing.zoning?.code || '-';

      // Price: millions format (2.7M)
      const price = listing.price
        ? (listing.price >= 1000000
            ? `${(listing.price / 1000000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`
            : listing.price.toLocaleString())
        : '-';

      // Zebra stripes - alternate row colors
      const rowBg = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      const cellStyle = `padding: 10px 12px; font-size: 13px; color: #333; vertical-align: middle; background-color: ${rowBg}; border-bottom: 1px solid #eee;`;

      // Unique row ID to prevent Gmail from collapsing rows
      const rowId = `listing-${listing.id}-${index}-${type.replace(/\s/g, '')}`;

      rowsHtml += `
        <tr data-row-id="${rowId}">
          <td style="${cellStyle} text-align: center;"><!-- ${listing.id} -->${idDisplay}</td>
          <td style="${cellStyle} text-align: left;">${location}</td>
          <td style="${cellStyle} text-align: center;">${dimensions}</td>
          <td style="${cellStyle} text-align: center;">${rooms}</td>
          <td style="${cellStyle} text-align: center;">${sqFt}</td>
          <td style="${cellStyle} text-align: center;">${condition}</td>
          <td style="${cellStyle} text-align: center;">${other}</td>
          <td style="${cellStyle} text-align: center;">${notes}</td>
          <td style="${cellStyle} text-align: right; font-weight: bold;">${price}</td>
        </tr>
      `;
    });

    // Type section with header
    tablesHtml += `
      <!-- ${type} Section -->
      <h2 style="text-align: center; font-size: 24px; font-weight: 700; color: #2c2c2c; margin: 40px 0 20px 0; font-family: 'Georgia', 'Times New Roman', serif; letter-spacing: 0.5px;">${type}</h2>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%;">
        ${tableHeader}
        ${rowsHtml}
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.4; color: #000000; margin: 0; padding: 20px; background-color: #ffffff;">
        <div style="width: 100%; max-width: 1200px; margin: 0 auto;">

          <!-- Title -->
          <h1 style="text-align: center; font-size: 28px; font-weight: 700; color: #2E7D32; margin-bottom: 20px; font-family: 'Georgia', 'Times New Roman', serif; letter-spacing: 0.5px;">${title}</h1>

          <!-- Tables by type -->
          ${tablesHtml}

          <!-- Footer -->
          <div style="text-align: center; margin-top: 50px; padding: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 15px;">
              <span style="color: #2E7D32; font-weight: bold; font-style: italic;">Eretz</span>
              <span style="color: #333; font-weight: normal;"> Realty</span>
            </p>
            <p style="margin: 0; font-size: 12px; color: #888;">This is an automated property update.</p>
          </div>

        </div>
      </body>
    </html>
  `;
}
