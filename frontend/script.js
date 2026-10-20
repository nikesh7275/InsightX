const money = value =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);

const salesData = [
    { month: "Jan", sales: 42000, region: "North", category: "Electronics" },
    { month: "Feb", sales: 48000, region: "South", category: "Clothing" },
    { month: "Mar", sales: 44500, region: "East", category: "Beauty" },
    { month: "Apr", sales: 61000, region: "West", category: "Electronics" },
    { month: "May", sales: 57500, region: "North", category: "Home & Kitchen" },
    { month: "Jun", sales: 69000, region: "South", category: "Electronics" },
    { month: "Jul", sales: 63000, region: "East", category: "Clothing" },
    { month: "Aug", sales: 73500, region: "West", category: "Home & Kitchen" },
    { month: "Sep", sales: 68000, region: "North", category: "Beauty" },
    { month: "Oct", sales: 81000, region: "South", category: "Electronics" },
    { month: "Nov", sales: 84500, region: "East", category: "Clothing" },
    { month: "Dec", sales: 88000, region: "West", category: "Electronics" }
];

const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 28 },
    { name: "Home & Kitchen", value: 22 },
    { name: "Beauty", value: 15 }
];

const formatCompact = value => {
    if (value >= 100000) return "₹" + (value / 100000).toFixed(1) + "L";
    if (value >= 1000) return "₹" + (value / 1000).toFixed(0) + "K";
    return money(value);
};

let salesChart;
let categoryChart;

function getFilteredSales() {
    const period = document.getElementById("periodFilter").value;
    const region = document.getElementById("regionFilter").value;
    const category = document.getElementById("categoryFilter").value;

    let result = [...salesData];

    if (period !== "all") {
        result = result.slice(-Number(period));
    }

    if (region !== "all") {
        result = result.filter(item => item.region === region);
    }

    if (category !== "all") {
        result = result.filter(item => item.category === category);
    }

    return result;
}

function renderSalesChart() {
    const filtered = getFilteredSales();
    const labels = filtered.map(item => item.month);
    const values = filtered.map(item => item.sales);

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(document.getElementById("salesChart"), {
        type: "line",

        data: {
            labels,
            datasets: [{
                label: "Sales",
                data: values,
                borderColor: "#9b7aff",
                backgroundColor: context => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) return "rgba(139,92,246,0.12)";

                    const gradient = ctx.createLinearGradient(
                        0, chartArea.top, 0, chartArea.bottom
                    );

                    gradient.addColorStop(0, "rgba(139,92,246,0.30)");
                    gradient.addColorStop(1, "rgba(139,92,246,0.01)");

                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: "#b9a5ff",
                pointBorderColor: "#121a2d",
                pointBorderWidth: 2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false },

                tooltip: {
                    backgroundColor: "#1b2540",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "#394663",
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: context => "Sales: " + money(context.raw)
                    }
                }
            },

            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        color: "#8290aa",
                        font: { size: 10 }
                    }
                },

                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: "rgba(130,144,170,0.10)" },
                    ticks: {
                        color: "#8290aa",
                        font: { size: 10 },
                        callback: value => formatCompact(value)
                    }
                }
            }
        }
    });

    const total = filtered.reduce((sum, item) => sum + item.sales, 0);

    document.getElementById("totalSales").textContent = money(total);

    const averageMonthlySales = filtered.length
        ? total / filtered.length
        : 0;

    document.getElementById("totalProfit").textContent =
        money(Math.round(total * 0.78));

    document.getElementById("totalOrders").textContent =
        filtered.length
            ? filtered.length * 100
            : 0;

    document.getElementById("totalCustomers").textContent =
        filtered.length
            ? Math.round(filtered.length * 71.3)
            : 0;
}

function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart");

    categoryChart = new Chart(ctx, {
        type: "doughnut",

        data: {
            labels: categoryData.map(item => item.name),
            datasets: [{
                data: categoryData.map(item => item.value),
                backgroundColor: [
                    "#8b5cf6",
                    "#3b82f6",
                    "#22d3ee",
                    "#f59e0b"
                ],
                borderColor: "#121a2d",
                borderWidth: 4,
                hoverOffset: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "76%",

            plugins: {
                legend: { display: false },

                tooltip: {
                    backgroundColor: "#1b2540",
                    padding: 10,
                    callbacks: {
                        label: context =>
                            `${context.label}: ${context.raw}%`
                    }
                }
            }
        }
    });
}

function exportDemoReport() {
    const filtered = getFilteredSales();

    const rows = [
        ["Month", "Sales", "Region", "Category"],
        ...filtered.map(item => [
            item.month,
            item.sales,
            item.region,
            item.category
        ])
    ];

    const csv = rows
        .map(row => row.map(value => `"${value}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "InsightX_Demo_Sales_Report.csv";
    link.click();

    URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", () => {
    renderSalesChart();
    renderCategoryChart();

    ["periodFilter", "regionFilter", "categoryFilter"].forEach(id => {
        document.getElementById(id).addEventListener("change", renderSalesChart);
    });

    document.getElementById("refreshBtn").addEventListener("click", () => {
        renderSalesChart();

        const button = document.getElementById("refreshBtn");
        const originalText = button.innerHTML;

        button.innerHTML = '<i class="fa-solid fa-check"></i> Refreshed';

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 1200);
    });

    document.getElementById("exportBtn").addEventListener("click", exportDemoReport);
});
