import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

/**
 * Automated Tax Report Generator
 * Runs every 60 days — aggregates Verified docs, calculates VAT + Income Tax
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const docs = await base44.asServiceRole.entities.Document.filter({ status: "Verified" });

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const totalIncome = docs.filter(d => d.doc_type === "income").reduce((s, d) => s + (d.total_amount || 0), 0);
    const totalExpenses = docs.filter(d => d.doc_type === "expense").reduce((s, d) => s + (d.total_amount || 0), 0);
    const vatDue = docs.reduce((s, d) => s + (d.vat_amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const incomeTaxDue = Math.max(0, netProfit * 0.25);

    const existing = await base44.asServiceRole.entities.TaxReport.filter({ period });
    
    if (existing.length > 0) {
      await base44.asServiceRole.entities.TaxReport.update(existing[0].id, {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        vat_due: vatDue,
        income_tax_due: incomeTaxDue,
        status: "Ready",
      });
    } else {
      await base44.asServiceRole.entities.TaxReport.create({
        period,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        vat_due: vatDue,
        income_tax_due: incomeTaxDue,
        status: "Ready",
      });
    }

    // Create notification
    await base44.asServiceRole.entities.Notification.create({
      type: "tax_deadline",
      title: "דוח מס מוכן להגשה",
      message: `דוח ${period} מוכן. מע"מ לתשלום: ₪${vatDue.toLocaleString('he-IL')}. עבור לדוחות מס להורדה.`,
      severity: "warning",
      action_url: "/tax-reports",
    });

    return Response.json({
      success: true,
      period,
      totalIncome,
      totalExpenses,
      vatDue,
      incomeTaxDue,
      docsProcessed: docs.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});