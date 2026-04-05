import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { data: doc, event } = payload;

    // Only process verified documents
    if (!doc || doc.status !== "Verified") {
      return Response.json({ skipped: true, reason: "not verified" });
    }

    const dateIssued = doc.date_issued;
    if (!dateIssued) {
      return Response.json({ skipped: true, reason: "no date_issued" });
    }

    // Extract period YYYY-MM
    const period = dateIssued.slice(0, 7);

    // Find or create TaxReport for this period
    const existing = await base44.asServiceRole.entities.TaxReport.filter({ period });
    let report = existing && existing.length > 0 ? existing[0] : null;

    const isIncome = doc.doc_type === "income";
    const incomeAdd = isIncome ? (doc.net_amount || 0) : 0;
    const expenseAdd = !isIncome ? (doc.net_amount || 0) : 0;
    const vatAdd = (doc.vat_amount || 0) * (isIncome ? 1 : -1);

    if (!report) {
      // Create new TaxReport
      await base44.asServiceRole.entities.TaxReport.create({
        period,
        total_income: incomeAdd,
        total_expenses: expenseAdd,
        vat_due: vatAdd,
        income_tax_due: incomeAdd * 0.15,
        status: "Draft",
      });
    } else {
      // Update existing TaxReport
      const newIncome = (report.total_income || 0) + incomeAdd;
      const newExpenses = (report.total_expenses || 0) + expenseAdd;
      const newVat = (report.vat_due || 0) + vatAdd;
      await base44.asServiceRole.entities.TaxReport.update(report.id, {
        total_income: newIncome,
        total_expenses: newExpenses,
        vat_due: newVat,
        income_tax_due: newIncome * 0.15,
      });
    }

    return Response.json({ success: true, period });
  } catch (error) {
    // Log error as notification
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.Notification.create({
        type: "system",
        title: "שגיאת סנכרון דוח מס",
        message: `סנכרון מסמך לדוח מס נכשל: ${error.message}`,
        severity: "critical",
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});