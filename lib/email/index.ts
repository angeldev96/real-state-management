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

// Helper to group listings
function groupListingsByType(listings: ListingWithRelations[]) {
  const groups: Record<string, ListingWithRelations[]> = {};
  
  // Sort listings first to ensure consistent order (optional, but good)
  // We can sort by ID or price if needed. For now, rely on input order.
  
  listings.forEach(listing => {
    const typeName = listing.propertyType?.name || "Other";
    if (!groups[typeName]) {
      groups[typeName] = [];
    }
    groups[typeName].push(listing);
  });
  
  return groups;
}

// New Generator ensuring Black & White minimalist design
function generateListingsGridHtml(listings: ListingWithRelations[], title: string): string {
  const groups = groupListingsByType(listings);
  const sortedTypes = Object.keys(groups).sort(); // Alphabetical sort of types
  
  let contentHtml = "";

  const tableHeader = `
    <tr style="border-bottom: 2px solid #ccc;">
      <th style="padding: 10px; text-align: left; font-weight: bold; width: 60px;">#</th>
      <th style="padding: 10px; text-align: left; font-weight: bold;">Location</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Dimensions</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Rooms</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Square footage</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Condition</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Other</th>
      <th style="padding: 10px; text-align: center; font-weight: bold;">Notes</th>
      <th style="padding: 10px; text-align: right; font-weight: bold;">Price</th>
    </tr>
  `;

  for (const type of sortedTypes) {
    const typeListings = groups[type];
    
    // Group Header
    contentHtml += `
      <tr>
        <td colspan="9" style="padding: 20px 0 10px 0; text-align: center; font-family: 'Times New Roman', serif; font-size: 24px; font-weight: bold; border-bottom: 1px solid #777;">
          ${type}
        </td>
      </tr>
      ${tableHeader}
    `;

    // Rows
    typeListings.forEach((listing, index) => {
      // Logic for "New" label
      const isNew = listing.onMarket; // Using onMarket as proxy for 'Active/New' marketing status
      const idDisplay = isNew ? `<strong>New ${listing.id}</strong>` : `${listing.id}`;
      
      // Formatting values
      const location = listing.locationDescription || listing.address || '-';
      const dimensions = listing.dimensions || '-';
      const rooms = listing.rooms || '-';
      const sqFt = listing.squareFootage ? listing.squareFootage.toLocaleString() : '-';
      const condition = listing.condition?.name || '-';
      
      // MAPPING: Other -> Features
      const other = listing.features && listing.features.length > 0 
        ? listing.features.map(f => f.name).join(", ") 
        : '-';
      
      // MAPPING: Notes -> Zoning
      const notes = listing.zoning?.code || '-';
      
      // MAPPING: Price
      // Format: 3.2M or 2.750M or regular number
      // We'll stick to full number with commas for now unless user wants strict 'M' formatting
      const price = listing.price 
        ? (listing.price >= 1000000 
            ? `${(listing.price / 1000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 3 })}M` 
            : listing.price.toLocaleString()) 
        : '-';

      // Row Style - Minimalist, white background, light border bottom
      const rowStyle = "border-bottom: 1px solid #eeeeee;";
      const cellStyle = "padding: 12px 8px; font-size: 13px; color: #000; vertical-align: middle;";

      contentHtml += `
        <tr style="${rowStyle}">
          <td style="${cellStyle} text-align: left;">${idDisplay}</td>
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
    
    // Spacer between groups
    contentHtml += `<tr><td colspan="9" style="height: 40px;"></td></tr>`;
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
          
          <div style="text-align: center; margin-bottom: 30px;">
             <p style="margin: 0; font-size: 14px;">please review,</p>
             <p style="margin: 0; font-size: 14px;">Feel free to call for more details.</p>
             <p style="margin: 0; font-size: 14px;">please reply listing number for more details</p>
             <br/>
             <p style="margin: 0; font-weight: bold;">Thanks,</p>
             <p style="margin: 0; font-weight: bold;">Eretz Realty</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; width: 100%;">
            ${contentHtml}
          </table>
          
        </div>
      </body>
    </html>
  `;
}
