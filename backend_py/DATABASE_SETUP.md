# Python Backend Database Setup

## Quick Start

### Option 1: Automatic Setup (Recommended)
The Python backend automatically creates all database tables on first run using SQLAlchemy models from [app/schema.py](app/schema.py).

```bash
python main.py
```

This will:
1. Connect to MySQL database
2. Create all tables automatically
3. Set up all indexes and foreign keys
4. Start the API server

### Option 2: Manual SQL Setup
If you prefer to run SQL manually or want to set up the database before running the Python backend:

```bash
# Create database and all tables
mysql -u root -p < tripwise.sql

# Verify tables were created
mysql -u root -p tripwise -e "SHOW TABLES;"
```

## Database Files

### `tripwise.sql`
Complete database schema with all 7 tables:
- **users** - User authentication and management
- **destinations** - Travel destinations
- **reviews** - User reviews on destinations
- **travel_tips** - User-submitted travel tips
- **trip_plans** - User trip plans
- **trip_plan_items** - Activities/destinations in trip plans
- **contact_messages** - Contact form submissions

**Features:**
- All foreign key relationships
- Cascade delete rules
- Performance indexes
- Check constraints (rating 1-5)
- UTF-8 support (utf8mb4)
- InnoDB engine (ACID compliance)

### `migrations.sql`
Incremental migration scripts for:
- Adding admin role support
- Adding OAuth support (Google)
- Alternative table names (contacts vs contact_messages)
- Verification queries

## Database Environment Configuration

Configure your database connection in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tripwise
```

## Schema Overview

### Tables and Relationships

```
users (1) ──────┬──────> (Many) reviews
                ├──────> (Many) travel_tips
                └──────> (Many) trip_plans
                              │
                              └──> (Many) trip_plan_items ──> destinations (optional)

destinations (1) ────┬──────> (Many) reviews
                     └──────> (Many) trip_plan_items

contact_messages (Independent - no foreign keys)
```

### Key Constraints

**Cascade Delete:**
- Delete user → Deletes all their reviews, tips, and trip plans
- Delete trip_plan → Deletes all its items
- Delete destination → Deletes all its reviews, items reference becomes NULL

**Check Constraints:**
- Review rating must be between 1 and 5

**Unique Constraints:**
- User email must be unique
- User google_id must be unique (for OAuth)

## Indexes

Created for optimal query performance:

**Users:**
- email
- oauth_provider
- google_id
- is_active

**Destinations:**
- name
- category
- location

**Reviews:**
- user_id
- destination_id
- rating
- created_at

**Travel Tips:**
- user_id
- category
- created_at

**Trip Plans:**
- user_id
- start_date
- created_at

**Trip Plan Items:**
- trip_plan_id
- destination_id
- date

**Contact Messages:**
- email
- status
- created_at

## Timestamps

All tables include automatic timestamps:
- `created_at` - Set on record creation
- `updated_at` - Set on creation and updated on any modification

## Character Set

All tables use **utf8mb4** with **utf8mb4_unicode_ci** collation for:
- Full Unicode support
- Emoji support
- International character support

## Engine

All tables use **InnoDB** for:
- Foreign key constraint support
- ACID compliance
- Row-level locking
- Crash recovery

## Initial Data Setup

After creating the database, you can add some initial destinations:

```sql
INSERT INTO destinations (name, description, location, category) VALUES
('Eiffel Tower', 'Iconic iron tower in Paris', 'Paris, France', 'City'),
('Great Wall of China', 'Ancient fortification', 'China', 'Historical'),
('Safari National Park', 'Wildlife adventure', 'Kenya', 'Nature');
```

## Verification

Verify your setup:

```bash
# Connect to database
mysql -u root -p tripwise

# Show all tables
SHOW TABLES;

# Describe each table
DESCRIBE users;
DESCRIBE destinations;
DESCRIBE reviews;
DESCRIBE travel_tips;
DESCRIBE trip_plans;
DESCRIBE trip_plan_items;
DESCRIBE contact_messages;

# Check indexes
SHOW INDEX FROM users;

# Check foreign keys
SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'tripwise' AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Backup and Restore

### Backup
```bash
mysqldump -u root -p tripwise > tripwise_backup.sql
```

### Restore
```bash
mysql -u root -p tripwise < tripwise_backup.sql
```

## Reset Database

⚠️ **Warning: This will delete all data!**

```bash
mysql -u root -p -e "DROP DATABASE tripwise;"
mysql -u root -p < tripwise.sql
```

## Troubleshooting

### Connection Error
```
ERROR 2003 (HY000): Can't connect to MySQL server on 'localhost'
```
**Solution:** Ensure MySQL is running: `mysql -u root -p`

### Permission Denied
```
ERROR 1045 (28000): Access denied for user 'root'@'localhost'
```
**Solution:** Check username/password in `.env`

### Database Not Found
```
ERROR 1049 (42000): Unknown database 'tripwise'
```
**Solution:** Run `mysql -u root -p < tripwise.sql` to create database

### Foreign Key Constraint Error
```
ERROR 1452: Cannot add or update a child row
```
**Solution:** Ensure parent record exists before referencing it

## Database Tools

### MySQL Command Line
```bash
mysql -u root -p tripwise
```

### MySQL Workbench
GUI tool for database management - https://dev.mysql.com/downloads/workbench/

### phpMyAdmin
Web-based database management

### DBeaver
Cross-platform database IDE

## Related Files

- [app/schema.py](app/schema.py) - SQLAlchemy model definitions
- [app/database.py](app/database.py) - Database connection setup
- [config/settings.py](config/settings.py) - Configuration management
- [.env.example](.env.example) - Environment variable template

## Next Steps

1. ✅ Database created and tables initialized
2. 📝 Run `python main.py` to start the API
3. 📚 Visit http://localhost:8000/api/docs for API documentation
4. 🔌 Test endpoints with Swagger UI
5. 📊 Monitor database with your preferred tool

---

**Note:** The Python backend uses the same MySQL database as the PHP backend. Both can coexist and share the same data.
