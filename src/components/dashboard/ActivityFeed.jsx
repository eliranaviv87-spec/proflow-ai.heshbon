import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

const statusConfig = {
  Verified: { icon: CheckCircle2, color: "text-neon-cyan", bg: "bg-neon-cyan/10", label: "מאומת" },
  Pending_Review: { icon: Clock, color: "text-neon-amber", bg: "bg-neon-amber/10", label: "ממתין" },
  Processing: { icon: AlertCircle, color: "text-neon-purple", bg: "bg-neon-purple/10", label: "מעבד" },
  Archived: { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted/50", label: "בארכיון" },
};

export default function ActivityFeed({ documents = [] }) {
  const recentDocs = documents.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 col-span-2 lg:col-span-1"
    >
      <h3 className="text-sm font-medium text-foreground mb-4">פעילות אחרונה</h3>

      {recentDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            הכספת ריקה. זרוק לכאן חשבונית
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            והבינה המלאכותית שלנו תעשה את הקסם
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[340px] overflow-y-auto">
          {recentDocs.map((doc, i) => {
            const config = statusConfig[doc.status] || statusConfig.Processing;
            const Icon = config.icon;
            return (
              <div key={doc.id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{doc.supplier_name || "מסמך חדש"}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.doc_number ? `#${doc.doc_number}` : ""} 
                    {doc.total_amount ? ` • ₪${doc.total_amount.toLocaleString("he-IL")}` : ""}
                  </p>
                </div>
                <div className="text-left flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
                    {config.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {doc.created_date ? moment(doc.created_date).fromNow() : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}