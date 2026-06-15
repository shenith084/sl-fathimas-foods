import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function logAuditAction({
  adminUid,
  action,
  module,
  targetId,
  oldValue,
  newValue,
}: {
  adminUid: string;
  action: string;
  module: string;
  targetId?: string;
  oldValue?: unknown;
  newValue?: unknown;
}) {
  try {
    await adminDb.collection("audit_logs").add({
      admin_uid: adminUid,
      action,
      module,
      target_id: targetId || null,
      old_value: oldValue || null,
      new_value: newValue || null,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

export async function getAuditLogs({
  limit = 50,
  page = 1,
  module,
}: {
  limit?: number;
  page?: number;
  module?: string;
} = {}) {
  let query: FirebaseFirestore.Query = adminDb.collection("audit_logs");

  if (module && module !== "all") {
    query = query.where("module", "==", module);
  }

  // Get total count
  const countSnapshot = await query.count().get();
  const total = countSnapshot.data().count;

  // Pagination
  query = query.orderBy("timestamp", "desc");
  const offset = (page - 1) * limit;
  if (offset > 0) {
    query = query.offset(offset);
  }
  
  query = query.limit(limit);

  const snapshot = await query.get();

  const logs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || null,
  }));

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
