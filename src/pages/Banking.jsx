import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowUpDown, Check, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { toast } from "sonner";

export default function Banking() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ date: "", description: "", amount: "", tx_type: "debit" });

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const txs = await base44.entities.BankTransaction.list("-date", 100);
      setTransactions(txs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTransaction() {
    if (!form.date || !form.description || !form.amount) {
      toast.error("נא למלא את כל השדות");
      return;
    }
    await base44.entities.BankTransaction.create({
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      tx_type: form.tx_type,
    });
    toast.success("תנועה נוספה");
    setForm({ date: "", description: "", amount: "", tx_type: "debit" });
    setDialogOpen(false);
    loadTransactions();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const matched = transactions.filter((t) => t.match_status).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">בנקאות</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {matched} מתוך {transactions.length} תנועות הותאמו אוטומטית
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
              <Plus className="w-4 h-4" /> הוסף תנועה
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>הוסף תנועת בנק</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>תאריך</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-secondary/50 border-border/50" />
              </div>
              <div>
                <Label>תיאור</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary/50 border-border/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>סכום</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <Label>סוג</Label>
                  <Select value={form.tx_type} onValueChange={(v) => setForm({ ...form, tx_type: v })}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="debit">חיוב</SelectItem>
                      <SelectItem value="credit">זיכוי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddTransaction} className="w-full bg-primary text-primary-foreground">
                שמור
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {transactions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ArrowUpDown className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">אין עדיין תנועות בנקאיות</p>
          <p className="text-xs text-muted-foreground/60 mt-1">הוסף תנועות או חבר את חשבון הבנק</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-right text-muted-foreground text-xs">תאריך</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">תיאור</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">סכום</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">סוג</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">התאמה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="border-border/20 hover:bg-secondary/20">
                  <TableCell className="text-sm font-inter text-muted-foreground">
                    {tx.date ? moment(tx.date).format("DD/MM/YY") : "—"}
                  </TableCell>
                  <TableCell className="text-sm">{tx.description}</TableCell>
                  <TableCell className={`text-sm font-medium font-inter ${tx.tx_type === "credit" ? "text-neon-cyan" : "text-foreground"}`}>
                    {tx.tx_type === "credit" ? "+" : "-"}₪{Math.abs(tx.amount).toLocaleString("he-IL")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tx.tx_type === "credit" ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" : "bg-secondary text-muted-foreground border-border"}>
                      {tx.tx_type === "credit" ? "זיכוי" : "חיוב"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tx.match_status ? (
                      <Check className="w-4 h-4 text-neon-cyan" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}