import { CheckCircle2, Clock, Loader2, Archive, Eye } from "lucide-react";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  Verified: { icon: CheckCircle2, label: "מאומת", variant: "default", className: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" },
  Pending_Review: { icon: Clock, label: "ממתין לבדיקה", variant: "default", className: "bg-neon-amber/10 text-neon-amber border-neon-amber/20" },
  Processing: { icon: Loader2, label: "מעבד", variant: "default", className: "bg-neon-purple/10 text-neon-purple border-neon-purple/20" },
  Archived: { icon: Archive, label: "ארכיון", variant: "default", className: "bg-muted text-muted-foreground border-border" },
};

export default function DocumentTable({ documents = [] }) {
  if (documents.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-right text-muted-foreground text-xs">ספק</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">מס׳ מסמך</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">תאריך</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">סכום</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">מע״מ</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">קטגוריה</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">סטטוס</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">AI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => {
            const config = statusConfig[doc.status] || statusConfig.Processing;
            const StatusIcon = config.icon;
            return (
              <TableRow key={doc.id} className="border-border/20 hover:bg-secondary/20">
                <TableCell className="text-sm font-medium">{doc.supplier_name || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-inter">{doc.doc_number || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-inter">
                  {doc.date_issued ? moment(doc.date_issued).format("DD/MM/YY") : "—"}
                </TableCell>
                <TableCell className="text-sm font-medium font-inter">
                  {doc.total_amount ? `₪${doc.total_amount.toLocaleString("he-IL")}` : "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-inter">
                  {doc.vat_amount ? `₪${doc.vat_amount.toLocaleString("he-IL")}` : "—"}
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">{doc.ai_category || "—"}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={config.className}>
                    <StatusIcon className={`w-3 h-3 mr-1 ${doc.status === "Processing" ? "animate-spin" : ""}`} />
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {doc.confidence_score ? (
                    <span className={`text-xs font-inter font-medium ${doc.confidence_score >= 0.9 ? "text-neon-cyan" : "text-neon-amber"}`}>
                      {Math.round(doc.confidence_score * 100)}%
                    </span>
                  ) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}