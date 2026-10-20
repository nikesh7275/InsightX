import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine

# Project folder
PROJECT_DIR = Path(__file__).resolve().parent.parent

# Excel file
file_path = PROJECT_DIR / "data" / "Cleaned_Retail_Sales.xlsx"

# Read Excel data
df = pd.read_excel(file_path)

# MySQL connection details
username = "root"
password = input("Enter your MySQL root password: ")
host = "localhost"
database = "InsightX"

# Connect to MySQL
connection_string = (
    f"mysql+mysqlconnector://{username}:{password}"
    f"@{host}/{database}"
)

engine = create_engine(connection_string)

# Import data into MySQL
df.to_sql(
    name="retail_sales",
    con=engine,
    if_exists="replace",
    index=False
)

print("Data imported successfully into MySQL!")
print(f"Total rows imported: {len(df)}")

engine.dispose()
