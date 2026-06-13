import { adminDb } from "./src/lib/firebase-admin";

async function run() {
  console.log("Deleting old sambal items...");
  const snapshot = await adminDb.collection("products").get();
  let count = 0;
  for (const doc of snapshot.docs) {
    if (doc.id.includes("sambal-250g") || doc.id === "chicken-sambal-70g" || doc.id.includes("-70g")) {
      // Actually, wait, let me just delete EVERYTHING that is a sambal and then run seed route
      if (doc.id.includes("sambal")) {
        await doc.ref.delete();
        count++;
        console.log("Deleted", doc.id);
      }
    }
  }
  console.log(`Deleted ${count} old sambals.`);
}

run().catch(console.error);
