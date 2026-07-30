import type { Order } from "./types";

export async function downloadInvoice(order: Order, customerEmail: string) {
  // Dynamically import jsPDF and autoTable to avoid SSR crashes!
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  // Header styling
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CloudCart.", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", 170, 25);
  
  // Reset text color for body
  doc.setTextColor(40, 40, 40);
  
  // Order Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice To:", 14, 55);
  doc.setFont("helvetica", "normal");
  doc.text(customerEmail, 14, 62);
  doc.text(`Shipping Address: ${order.shipping_address || "N/A"}`, 14, 69);
  
  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", 130, 55);
  doc.text("Order Date:", 130, 62);
  doc.text("Status:", 130, 69);
  
  doc.setFont("helvetica", "normal");
  doc.text(order.order_id, 160, 55);
  
  const orderDate = new Date(parseInt(order.order_id.split("-")[1] || "0")).toLocaleDateString();
  doc.text(orderDate !== "Invalid Date" ? orderDate : "N/A", 160, 62);
  doc.text(order.order_status, 160, 69);
  
  // Table
  const tableData = order.items.map((item, idx) => [
    (idx + 1).toString(),
    item.product_name || item.product_id,
    item.quantity.toString(),
    `$${item.unit_price.toFixed(2)}`,
    `$${(item.quantity * item.unit_price).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [["#", "Item Description", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 40, halign: "right" }
    }
  });
  
  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text("Subtotal:", 130, finalY);
  doc.text("Tax (18%):", 130, finalY + 7);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", 130, finalY + 15);
  
  const subtotal = order.items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
  const tax = subtotal * 0.18;
  const grand = subtotal + tax + (subtotal > 500 ? 0 : 15);
  
  doc.setFont("helvetica", "normal");
  doc.text(`$${subtotal.toFixed(2)}`, 190, finalY, { align: "right" });
  doc.text(`$${tax.toFixed(2)}`, 190, finalY + 7, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(`$${grand.toFixed(2)}`, 190, finalY + 15, { align: "right" });
  
  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  
  // Save
  doc.save(`Invoice_${order.order_id}.pdf`);
}
