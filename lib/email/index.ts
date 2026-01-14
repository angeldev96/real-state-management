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
  const listingsHtml = listings
    .slice(0, 5)
    .map((listing, index) => {
      const badges = [];
      if (listing.onMarket) badges.push('<span class="badge-new">NEW LISTING</span>');

      return `
        <div class="property-card ${index === 0 ? 'featured' : ''}">
          ${index === 0 ? '<div class="featured-badge">⭐ Featured</div>' : ''}
          <div class="property-header">
            <h3 class="property-address">${listing.address}</h3>
            ${listing.price ? `<div class="property-price">$${listing.price.toLocaleString()}</div>` : ''}
          </div>

          <div class="property-details">
            ${listing.locationDescription ? `<p class="property-location">${listing.locationDescription}</p>` : ''}

            <div class="property-specs">
              ${listing.rooms ? `<div class="spec"><span class="spec-value">${listing.rooms}</span><span class="spec-label">Rooms</span></div>` : ''}
              ${listing.squareFootage ? `<div class="spec"><span class="spec-value">${listing.squareFootage.toLocaleString()}</span><span class="spec-label">Sq Ft</span></div>` : ''}
              ${listing.dimensions ? `<div class="spec"><span class="spec-value">${listing.dimensions}</span><span class="spec-label">Lot</span></div>` : ''}
            </div>

            <div class="property-meta">
              ${listing.propertyType ? `<span class="meta-tag">${listing.propertyType.name}</span>` : ''}
              ${listing.condition ? `<span class="meta-tag">${listing.condition.name}</span>` : ''}
              ${listing.zoning ? `<span class="meta-tag">${listing.zoning.code}</span>` : ''}
              ${badges.join('')}
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eretz Realty - Featured Properties</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f5f5f5;
            -webkit-font-smoothing: antialiased;
          }

          .email-wrapper {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #065f46 0%, #047857 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.4;
          }

          .header-logo {
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
          }

          .header-subtitle {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 1;
            font-weight: 400;
          }

          /* Hero Section */
          .hero {
            background: linear-gradient(to right, #ecfdf5, #d1fae5);
            padding: 30px 40px;
            text-align: center;
            border-bottom: 1px solid #d1fae5;
          }

          .hero-title {
            font-size: 24px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 10px;
          }

          .hero-text {
            font-size: 15px;
            color: #047857;
            opacity: 0.8;
          }

          /* Stats Bar */
          .stats-bar {
            display: flex;
            justify-content: center;
            gap: 40px;
            padding: 25px 40px;
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #065f46;
            line-height: 1;
          }

          .stat-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 5px;
          }

          /* Content */
          .content {
            padding: 40px;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 25px;
            padding-bottom: 12px;
            border-bottom: 2px solid #d1fae5;
          }

          /* Property Cards */
          .property-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            transition: all 0.2s ease;
            position: relative;
          }

          .property-card.featured {
            background: linear-gradient(to right, #f0fdf4, #ffffff);
            border-color: #047857;
            border-width: 2px;
          }

          .featured-badge {
            position: absolute;
            top: -10px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          }

          .property-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .property-address {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .property-price {
            font-size: 22px;
            font-weight: 700;
            color: #065f46;
          }

          .property-location {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
          }

          .property-specs {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
          }

          .spec {
            display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9fafb;
    padding: 10px 16px;
    border-radius: 8px;
    min-width: 70px;
  }

  .spec-value {
    font-size: 16px;
    font-weight: 600;
    color: #065f46;
  }

  .spec-label {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }

  .property-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .meta-tag {
    display: inline-block;
    background: #f3f4f6;
    color: #4b5563;
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .badge-new {
    background: linear-gradient(135deg, #065f46, #047857);
    color: white;
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* Footer */
  .footer {
    background: #1f2937;
    padding: 40px;
    text-align: center;
  }

  .footer-text {
    font-size: 13px;
    color: #9ca3af;
    line-height: 1.6;
  }

  .footer-link {
    color: #047857;
    text-decoration: none;
  }

  .footer-divider {
    width: 50px;
    height: 2px;
    background: #047857;
    margin: 20px auto;
  }

  /* Responsive */
  @media only screen and (max-width: 600px) {
    .header, .hero, .content, .footer {
      padding: 30px 20px !important;
    }

    .stats-bar {
      gap: 20px !important;
      padding: 20px !important;
    }

    .property-header {
      flex-direction: column !important;
    }

    .property-price {
      margin-top: 10px;
    }

    .property-specs {
      flex-wrap: wrap !important;
      gap: 10px !important;
    }
  }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="header-logo">Eretz Realty</div>
            <div class="header-subtitle">Exclusive Property Listings</div>
          </div>

          <!-- Hero -->
          <div class="hero">
            <div class="hero-title">Featured Properties</div>
            <div class="hero-text">Handpicked properties from our exclusive collection</div>
          </div>

          <!-- Stats -->
          <div class="stats-bar">
            <div class="stat">
              <div class="stat-value">${listings.length}</div>
              <div class="stat-label">Total Listings</div>
            </div>
            <div class="stat">
              <div class="stat-value">${listings.filter((l) => l.onMarket).length}</div>
              <div class="stat-label">New to Market</div>
            </div>
            <div class="stat">
              <div class="stat-value">${listings.filter((l) => l.isActive).length}</div>
              <div class="stat-label">Active</div>
            </div>
          </div>

          <!-- Content -->
          <div class="content">
            <div class="section-title">Available Properties</div>
            ${listingsHtml}
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-divider"></div>
            <p class="footer-text">
              <strong>Eretz Realty</strong><br>
              Your trusted partner in Brooklyn real estate<br><br>
              &copy; ${new Date().getFullYear()} Eretz Realty. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
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
