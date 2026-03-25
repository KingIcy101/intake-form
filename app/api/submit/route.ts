import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://skmzjnxkoxdogntqbesu.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const row = {
      business_name: body.businessName || null,
      owner_name: body.ownerName || null,
      industry: body.industry || null,
      website_url: body.websiteUrl || null,
      business_address: body.businessAddress || null,
      business_email: body.businessEmail || null,
      transfer_phone: body.transferPhone || null,
      missed_calls_per_week: body.missedCallsPerWeek || null,
      after_hours_situation: body.afterHoursSituation || null,
      services_description: body.servicesDescription || null,
      top_questions: body.topQuestions || null,
      never_discuss: body.neverDiscuss || null,
      pricing_info: body.pricingInfo || null,
      staff_names: body.staffNames || null,
      timezone: body.timezone || null,
      schedule: body.schedule ? JSON.stringify(body.schedule) : null,
      after_hours_behavior: body.afterHoursBehavior || null,
      has_holiday_closures: body.hasHolidayClosures === 'yes',
      holiday_details: body.holidayDetails || null,
      transfer_triggers: body.transferTriggers ? JSON.stringify(body.transferTriggers) : null,
      no_answer_behavior: body.noAnswerBehavior || null,
      book_appointments: body.booksAppointments === 'yes',
      calendar_tool: body.calendarTool || null,
      appointment_types: body.appointmentTypes || null,
      booking_rules: body.bookingRules || null,
      personality: body.personality || null,
      agent_name: body.agentName || null,
      phrases_to_use: body.phrasesToUse || null,
      phrases_to_avoid: body.phrasesToAvoid || null,
      faqs: body.faqs ? JSON.stringify(body.faqs) : null,
      has_emergencies: body.hasEmergencies === 'yes',
      client_type: body.clientType || null,
      other_compliance: body.otherCompliance || null,
      status: 'intake_received',
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/intake_submissions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[submit] Supabase error:', err)
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ ok: true, id: data[0]?.id })
  } catch (err: any) {
    console.error('[submit] Error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
