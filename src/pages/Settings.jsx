import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Building2, Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Settings() {
  const [org, setOrg] = useState(null);
  const [form, setForm] = useState({
    business_name: "",
    tax_id: "",
    base_currency: "ILS",
    subscription_tier: "Starter",
    advance_tax_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const orgs = await base44.entities.Organization.list("-created_date", 1);
        if (orgs.length > 0) {
          setOrg(orgs[0]);
          setForm({
            business_name: orgs[0].business_name || "",
            tax_id: orgs[0].tax_id || "",
            base_currency: orgs[0].base_currency || "ILS",
            subscription_tier: orgs[0].subscription_tier || "Starter",
            advance_tax_rate: orgs[0].advance_tax_rate || 0,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      if (org) {
        await base44.entities.Organization.update(org.id, form);
      } else {
        const created = await base44.entities.Organization.create(form);
        setOrg(created);
      }
      toast.success("ההגדרות נשמרו בהצלחה");
    } catch (e) {
      toast.error("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">הגדרות</h1>
        <p className="text-sm text-muted-foreground mt-1">הגדרות הארגון והמערכת</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">פרטי עסק</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>שם העסק</Label>
            <Input
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <Label>מספר עוסק / ח.פ.</Label>
            <Input
              value={form.tax_id}
              onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <Label>מטבע בסיס</Label>
            <Select value={form.base_currency} onValueChange={(v) => setForm({ ...form, base_currency: v })}>
              <SelectTrigger className="bg-secondary/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="ILS">₪ שקל</SelectItem>
                <SelectItem value="USD">$ דולר</SelectItem>
                <SelectItem value="EUR">€ אירו</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>שיעור מקדמות מס (%)</Label>
            <Input
              type="number"
              value={form.advance_tax_rate}
              onChange={(e) => setForm({ ...form, advance_tax_rate: parseFloat(e.target.value) || 0 })}
              className="bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        <div>
          <Label>מסלול מנוי</Label>
          <Select value={form.subscription_tier} onValueChange={(v) => setForm({ ...form, subscription_tier: v })}>
            <SelectTrigger className="bg-secondary/50 border-border/50 w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          שמור הגדרות
        </Button>
      </div>
    </div>
  );
}