import pandas as pd
from pathlib import Path

# Project folder ka path
PROJECT_DIR = Path(__file__).resolve().parent.parent

# Excel file ka path
file_path = PROJECT_DIR / "data" / "InsightX_Retail_Sales_Dataset.xlsx"

# Excel file read karo
df = pd.read_excel(file_path, sheet_name="Sales_Data")

print("\n===== INSIGHTX BUSINESS ANALYTICS =====")

print("\nFirst 5 Records:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns.tolist())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Records:")
print(df.duplicated().sum())

print("\nSales Summary:")
print(df[["Sales", "Cost", "Profit"]].describe())





# ==========================================
# INSIGHTX - EXPLORATORY DATA ANALYSIS
# ==========================================

import matplotlib.pyplot as plt

print("\n========== EXPLORATORY DATA ANALYSIS ==========")

# 1. Overall Business KPIs
total_sales = df["Sales"].sum()
total_profit = df["Profit"].sum()
total_orders = df["Order_ID"].nunique()
total_customers = df["Customer_ID"].nunique()

profit_margin = (
    total_profit / total_sales * 100
    if total_sales != 0 else 0
)

print(f"\nTotal Sales: ${total_sales:,.2f}")
print(f"Total Profit: ${total_profit:,.2f}")
print(f"Total Orders: {total_orders:,}")
print(f"Unique Customers: {total_customers:,}")
print(f"Profit Margin: {profit_margin:.2f}%")

# 2. Monthly Sales Analysis
df["Order_Date"] = pd.to_datetime(df["Order_Date"])

df["Month"] = df["Order_Date"].dt.to_period("M").astype(str)

monthly_sales = df.groupby("Month")["Sales"].sum()

print("\nMonthly Sales:")
print(monthly_sales)

# 3. Category-wise Sales
category_sales = df.groupby("Category")["Sales"].sum().sort_values(
    ascending=False
)

print("\nCategory-wise Sales:")
print(category_sales)

# 4. Region-wise Sales
region_sales = df.groupby("Region")["Sales"].sum().sort_values(
    ascending=False
)

print("\nRegion-wise Sales:")
print(region_sales)

# 5. Top 10 Products
product_sales = df.groupby("Product")["Sales"].sum().sort_values(
    ascending=False
).head(10)

print("\nTop 10 Products:")
print(product_sales)

# 6. Monthly Sales Chart
plt.figure(figsize=(12, 6))
monthly_sales.plot(kind="line", marker="o")

plt.title("InsightX - Monthly Sales Trend")
plt.xlabel("Month")
plt.ylabel("Sales")
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()

chart_path = PROJECT_DIR / "reports" / "monthly_sales.png"
plt.savefig(chart_path, dpi=150)
plt.close()

print(f"\nMonthly Sales Chart saved at: {chart_path}")

# 7. Category Sales Chart
plt.figure(figsize=(10, 6))
category_sales.plot(kind="bar")

plt.title("InsightX - Category-wise Sales")
plt.xlabel("Category")
plt.ylabel("Sales")
plt.xticks(rotation=30)
plt.tight_layout()

category_chart_path = PROJECT_DIR / "reports" / "category_sales.png"
plt.savefig(category_chart_path, dpi=150)
plt.close()

print(f"Category Sales Chart saved at: {category_chart_path}")





# Save cleaned dataset
cleaned_file = PROJECT_DIR / "data" / "Cleaned_Retail_Sales.xlsx"

df.to_excel(cleaned_file, index=False)

print("\nCleaned dataset saved successfully!")
print(f"File location: {cleaned_file}")

