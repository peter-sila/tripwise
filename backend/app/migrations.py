"""
Database migration utilities for adding missing columns
"""
from sqlalchemy import text, inspect
from app.database import engine
import logging

logger = logging.getLogger(__name__)

def run_migrations():
    """
    Run all pending database migrations
    Specifically adds updated_at columns to tables that are missing them
    """
    migrations = [
        {
            "name": "Add updated_at to destinations",
            "sql": "ALTER TABLE destinations ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "destinations",
            "column": "updated_at"
        },
        {
            "name": "Add updated_at to reviews",
            "sql": "ALTER TABLE reviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "reviews",
            "column": "updated_at"
        },
        {
            "name": "Add updated_at to travel_tips",
            "sql": "ALTER TABLE travel_tips ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "travel_tips",
            "column": "updated_at"
        },
        {
            "name": "Add updated_at to trip_plans",
            "sql": "ALTER TABLE trip_plans ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "trip_plans",
            "column": "updated_at"
        },
        {
            "name": "Add updated_at to trip_plan_items",
            "sql": "ALTER TABLE trip_plan_items ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "trip_plan_items",
            "column": "updated_at"
        },
        {
            "name": "Add updated_at to contact_messages",
            "sql": "ALTER TABLE contact_messages ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at",
            "table": "contact_messages",
            "column": "updated_at"
        },
    ]
    
    with engine.connect() as connection:
        inspector = inspect(engine)
        
        for migration in migrations:
            table_name = migration["table"]
            column_name = migration["column"]
            
            try:
                # Check if table exists
                if not inspector.has_table(table_name):
                    logger.info(f"Table {table_name} does not exist yet, skipping")
                    continue
                
                # Get existing columns
                columns = [col["name"] for col in inspector.get_columns(table_name)]
                
                # Check if column already exists
                if column_name in columns:
                    logger.info(f"✓ {migration['name']} - Column already exists")
                    continue
                
                # Execute migration
                logger.info(f"Executing: {migration['name']}")
                connection.execute(text(migration["sql"]))
                connection.commit()
                logger.info(f"✓ {migration['name']} - Success")
                
            except Exception as e:
                logger.error(f"✗ {migration['name']} - Error: {str(e)}")
                # Continue with next migration on error
                continue

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_migrations()
