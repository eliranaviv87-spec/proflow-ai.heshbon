import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Webhook receiver for Open Banking API
// Accepts: POST with body: [ {date, description, amount, reference, type} ]
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const transactions = Array.isArray(body) ? body : body.transactions || [];

    if (!transactions.length) {
      return Response.json({ error: 'No transactions provided' }, { status: 400 });
    }

    const results = [];
    for (const tx of transactions) {
      const created = await base44.asServiceRole.entities.BankTransaction.create({
        date: tx.date,
        description: tx.description || tx.reference || 'עסקה',
        amount: Math.abs(tx.amount),
        tx_type: tx.amount >= 0 ? 'credit' : 'debit',
        match_status: false,
      });

      // Try auto-match
      const docs = await base44.asServiceRole.entities.Document.filter({ status: 'Verified' });
      const txDate = new Date(tx.date);
      const match = docs.find((doc) => {
        if (!doc.date_issued) return false;
        const diff = Math.abs(new Date(doc.date_issued) - txDate) / 86400000;
        return doc.total_amount === Math.abs(tx.amount) && diff <= 5;
      });

      if (match) {
        await base44.asServiceRole.entities.BankTransaction.update(created.id, {
          linked_doc_id: match.id,
          match_status: true,
        });
        await base44.asServiceRole.entities.Document.update(match.id, { status: 'Archived' });
        await base44.asServiceRole.entities.AuditLog.create({
          action: `Webhook auto-match: Tx ${created.id} ← Doc ${match.id}`,
          entity_type: 'BankTransaction',
          entity_id: created.id,
        });
      }

      results.push({ id: created.id, matched: !!match });
    }

    return Response.json({ success: true, processed: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});