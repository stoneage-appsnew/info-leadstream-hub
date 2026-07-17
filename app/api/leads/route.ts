import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const {
      markets,
      agentType,
      firstName,
      lastName,
      email,
      phone,
      consent,
      marketingConsent,
      howSoon,
      monthlyBudget,
      contactMethod,
      bestTime,
    } = body;

    if (
      !markets ||
      !agentType ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !howSoon ||
      !monthlyBudget ||
      !contactMethod ||
      (contactMethod === "Schedule a Call" && !bestTime)
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create new lead
    const lead = await Lead.create({
      markets,
      agentType,
      agencySize: body.agencySize || null,
      firstName,
      lastName,
      email,
      phone,
      consent: !!consent,
      marketingConsent: !!marketingConsent,
      howSoon,
      monthlyBudget,
      contactMethod,
      bestTime: contactMethod === "Schedule a Call" ? bestTime : null,
      status: "new",
    });

    // Send email using Resend in the background (does not block the response)
    const fromEmail = process.env.EMAIL_FROM;
    const toEmail = process.env.EMAIL_TO;

    if (fromEmail && toEmail) {
      after(async () => {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `new lead - ${firstName} ${lastName}`,
            html: `
              <h3>New Lead Details:</h3>
              <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
                <tbody>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                    <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Markets</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${Array.isArray(markets) ? markets.join(", ") : markets}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Agent Type</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${agentType}</td>
                  </tr>
                  ${body.agencySize ? `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Agency Size</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${body.agencySize}</td>
                  </tr>
                  ` : ""}
                  <tr style="background-color: ${body.agencySize ? "#f9f9f9" : "#ffffff"};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">How Soon</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${howSoon}</td>
                  </tr>
                  <tr style="background-color: ${body.agencySize ? "#ffffff" : "#f9f9f9"};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Monthly Budget</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${monthlyBudget}</td>
                  </tr>
                  <tr style="background-color: ${body.agencySize ? "#f9f9f9" : "#ffffff"};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Preferred Contact</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${contactMethod}</td>
                  </tr>
                  ${contactMethod === "Schedule a Call" && bestTime ? `
                  <tr style="background-color: ${body.agencySize ? "#ffffff" : "#f9f9f9"};">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Best Time to Call</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${bestTime}</td>
                  </tr>
                  ` : ""}
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Non-Marketing SMS Consent</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${consent ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Marketing SMS Consent</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${marketingConsent ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            `,
          });
          console.log(`Successfully sent email notification for lead: ${firstName} ${lastName}`);
        } catch (emailError) {
          console.error("Error sending lead notification email via Resend:", emailError);
        }
      });
    } else {
      console.warn("Resend email notification skipped: EMAIL_FROM or EMAIL_TO environment variable is missing.");
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 },
    );
  }
}


// GET /api/leads - Get all leads (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build query
    const query = status && status !== "all" ? { status } : {};

    // Fetch leads, sorted by most recent first
    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();

    // Transform leads to match frontend interface
    const transformedLeads = leads.map((lead) => ({
      id: lead._id.toString(),
      markets: lead.markets,
      agentType: lead.agentType,
      agencySize: lead.agencySize || null,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      createdAt: lead.createdAt,
      howSoon: lead.howSoon || null,
      monthlyBudget: lead.monthlyBudget || null,
      contactMethod: lead.contactMethod || null,
      bestTime: lead.bestTime || null,
    }));

    return NextResponse.json(
      { success: true, leads: transformedLeads },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
