import type { Product, Order, Payment } from "./types";

export async function downloadInventoryReport(products: Product[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Inventory Snapshot", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);
  doc.text(`Total Products: ${products.length}`, 14, 47);

  const tableData = products.map((p) => [
    p.product_id,
    p.product_name,
    `$${p.price.toFixed(2)}`,
    p.stock.toString()
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Product ID", "Name", "Unit Price", "Available Stock"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Inventory_Report.pdf");
}

export async function downloadOrdersReport(orders: Order[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Orders Export", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);
  doc.text(`Total Orders: ${orders.length}`, 14, 47);

  const tableData = orders.map((o) => [
    o.order_id,
    o.customer_id,
    o.order_status,
    `$${o.total_amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Order ID", "Customer", "Status", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Orders_Report.pdf");
}

export async function downloadRevenueReport(orders: Order[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Revenue Report", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

  let totalRevenue = 0;
  let deliveredRevenue = 0;

  orders.forEach(o => {
    if (o.order_status !== "Cancelled") totalRevenue += o.total_amount;
    if (o.order_status === "Delivered") deliveredRevenue += o.total_amount;
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Gross Revenue: $${totalRevenue.toFixed(2)}`, 14, 55);
  doc.text(`Realized (Delivered) Revenue: $${deliveredRevenue.toFixed(2)}`, 14, 63);

  autoTable(doc, {
    startY: 75,
    head: [["Order ID", "Amount", "Status"]],
    body: orders.filter(o => o.order_status !== "Cancelled").map(o => [
      o.order_id,
      `$${o.total_amount.toFixed(2)}`,
      o.order_status
    ]),
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Revenue_Report.pdf");
}

export async function downloadCustomerSegmentsReport(orders: Order[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Segments", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

  // Group by customer_id
  const customers: Record<string, { spent: number, count: number }> = {};
  orders.forEach(o => {
    if (o.order_status !== "Cancelled") {
      if (!customers[o.customer_id]) customers[o.customer_id] = { spent: 0, count: 0 };
      customers[o.customer_id].spent += o.total_amount;
      customers[o.customer_id].count += 1;
    }
  });

  const sortedCustomers = Object.entries(customers).sort((a, b) => b[1].spent - a[1].spent);

  doc.text(`Total Active Customers: ${sortedCustomers.length}`, 14, 47);

  const tableData = sortedCustomers.map(([email, data]) => [
    email,
    data.count.toString(),
    `$${data.spent.toFixed(2)}`,
    data.spent > 500 ? "VIP" : data.spent > 100 ? "Regular" : "New"
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Customer Email", "Total Orders", "Total Spent", "Segment"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Customer_Segments_Report.pdf");
}

export async function downloadRefundsReport(orders: Order[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Refunds & Cancellations", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

  const cancelledOrders = orders.filter(o => o.order_status === "Cancelled");
  
  let totalRefunded = 0;
  cancelledOrders.forEach(o => { totalRefunded += o.total_amount; });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount Refunded: $${totalRefunded.toFixed(2)}`, 14, 55);

  const tableData = cancelledOrders.map(o => [
    o.order_id,
    o.customer_id,
    `$${o.total_amount.toFixed(2)}`,
    "Refund Initiated"
  ]);

  autoTable(doc, {
    startY: 65,
    head: [["Order ID", "Customer", "Refund Amount", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Refunds_Report.pdf");
}

export async function downloadPaymentReconciliationReport(payments: Payment[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  doc.setFillColor(23, 23, 23);
  doc.rect(0, 0, 210, 30, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Reconciliation", 14, 20);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);
  doc.text(`Total Processed Payments: ${payments.length}`, 14, 47);

  const tableData = payments.map(p => [
    p.payment_id,
    p.order_id,
    p.payment_method,
    p.payment_status || "Completed",
    `$${p.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Payment ID", "Order ID", "Method", "Status", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255] },
  });

  doc.save("Payment_Reconciliation_Report.pdf");
}
