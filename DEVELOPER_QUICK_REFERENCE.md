# TripWise Developer Quick Reference

## 🚀 Quick Start (5 minutes)

```bash
# 1. Create database
mysql -u root -p < backend/db/tripwise.sql

# 2. Configure backend/config/constants.php with MySQL credentials

# 3. Start PHP server
cd d:\wise\tripwise
php -S localhost:8000

# 4. Start React app (in new terminal)
cd frontend
npm install
npm run dev

# 5. Open http://localhost:5173 in browser
```

---

## 📁 Key Files & Purposes

| File | Purpose | Lines | Key Functions |
|------|---------|-------|----------------|
| `backend/db/tripwise.sql` | Database schema | 150+ | 6 tables with relationships |
| `backend/config/config.php` | DB & CORS config | 174+ | `getDBConnection()`, `enableCORS()` |
| `backend/includes/auth.php` | Auth utilities | 250+ | `login()`, `register()`, `requireAuth()` |
| `backend/api/auth.php` | Auth endpoint | 80+ | POST login/register/logout, GET verify |
| `backend/api/destinations.php` | Destinations | 80+ | GET list, POST create |
| `backend/api/reviews.php` | Reviews | 80+ | GET reviews, POST create |
| `backend/api/travelTips.php` | Tips | 80+ | GET tips, POST create |
| `backend/api/aiPlanner.php` | Trip planning | 100+ | GET plans, POST create with items |
| `frontend/src/users/destinations.jsx` | Destinations page | - | Browse & filter destinations |
| `frontend/src/users/discover.jsx` | Search page | - | Search & discovery |
| `frontend/src/users/reviews.jsx` | Reviews page | - | View & create reviews |
| `frontend/src/users/travelTips.jsx` | Tips page | - | Browse travel tips |
| `frontend/src/users/AIPlanner.jsx` | Trip planner | - | Create & manage trips |

---

## 🔌 API Endpoints

### Authentication
```
POST /auth.php - {"action":"login","email":"...","password":"..."}
POST /auth.php - {"action":"register","email":"...","password":"...","name":"..."}
POST /auth.php - {"action":"logout"}
GET  /auth.php - (requires Bearer token)
```

### Destinations
```
GET  /destinations.php?search=X&category=Y
POST /destinations.php - {"name":"...","description":"...","location":"..."}
```

### Reviews
```
GET  /reviews.php?destination_id=1
POST /reviews.php - {"destination_id":1,"rating":5,"comment":"..."}
```

### Travel Tips
```
GET  /travelTips.php?category=packing
POST /travelTips.php - {"title":"...","content":"...","category":"..."}
```

### Trip Planning
```
GET  /aiPlanner.php
POST /aiPlanner.php - {"title":"...","start_date":"...","end_date":"...","items":[...]}
```

---

## 🗄️ Database Quick Reference

### Users
```sql
id | email | password_hash | name | created_at | updated_at
```

### Destinations
```sql
id | name | description | location | image_url | category | created_at
```

### Reviews
```sql
id | user_id(FK) | destination_id(FK) | rating(1-5) | comment | created_at
```

### Travel Tips
```sql
id | user_id(FK) | title | content | category | created_at
```

### Trip Plans
```sql
id | user_id(FK) | title | description | start_date | end_date | created_at
```

### Trip Plan Items
```sql
id | trip_plan_id(FK) | destination_id(FK) | title | description | date | time | created_at
```

---

## 🔑 Frontend Patterns

### Fetch Data
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${API_BASE}/endpoint.php`)
    .then(r => r.json())
    .then(d => setData(d.key || []))
    .catch(e => console.error(e))
    .finally(() => setLoading(false));
}, []);
```

### Filter with Memo
```jsx
const filtered = useMemo(() =>
  !filter ? data : data.filter(item => item.category === filter)
, [filter, data]);
```

### Authentication
```jsx
// Store after login
localStorage.setItem('token', token);

// Use in request
fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Clear on logout
localStorage.removeItem('token');
```

---

## 🔐 Authentication Flow

```
1. User submits email/password
   ↓
2. Backend hashes password with bcrypt
   ↓
3. Compare with stored hash
   ↓
4. If match, return user_id as token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Include "Authorization: Bearer {token}" in future requests
```

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | CORS not enabled | Verify `enableCORS()` called in all API files |
| 404 API | Wrong URL path | Use `http://localhost:8000/backend/api/` |
| DB connection fail | Wrong credentials | Check `constants.php` has correct MySQL password |
| 401 Unauthorized | Missing/invalid token | Send `Authorization: Bearer <token>` header |
| Parse error in JS | Syntax error in file | Check for missing brackets, semicolons |
| No data displayed | Empty database | Insert test data into database |

---

## 📝 Code Comments Style

### File Header
```php
/**
 * Feature Description
 * 
 * What this file does and its main responsibilities
 */
```

### Function Header
```php
/**
 * Function Description
 * 
 * @param type $name - Description
 * @return type - What it returns
 */
```

### Inline Comments
```php
// Explain WHY, not WHAT
// GOOD: Check if rating is valid (1-5 scale)
// BAD: Check rating

if ($rating < 1 || $rating > 5) { ... }
```

---

## 🧪 Testing Commands

```bash
# Test API endpoint with curl
curl http://localhost:8000/backend/api/destinations.php

# Test with JSON POST
curl -X POST http://localhost:8000/backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"user@example.com","password":"pass123"}'

# Test with authentication
curl http://localhost:8000/backend/api/aiPlanner.php \
  -H "Authorization: Bearer 1"

# Test with query params
curl "http://localhost:8000/backend/api/destinations.php?search=safari&category=activity"
```

---

## 🎯 HTTP Status Codes Used

| Code | Meaning | Used For |
|------|---------|----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST (new resource) |
| 400 | Bad Request | Missing/invalid fields |
| 401 | Unauthorized | Authentication required/invalid |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Unexpected error |

---

## 🛠️ Common Development Tasks

### Add New Destination
```sql
INSERT INTO destinations (name, description, location, category) 
VALUES ('Name', 'Description', 'Location', 'activity');
```

### Test Login
```bash
curl -X POST http://localhost:8000/backend/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"login","email":"user@example.com","password":"password123"}'
```

### Get All Reviews for Destination
```bash
curl "http://localhost:8000/backend/api/reviews.php?destination_id=1"
```

### Create Trip Plan
```bash
curl -X POST http://localhost:8000/backend/api/aiPlanner.php \
  -H "Authorization: Bearer 1" \
  -H "Content-Type: application/json" \
  -d '{"title":"Safari Trip","start_date":"2024-06-01","end_date":"2024-06-05"}'
```

---

## 📚 Documentation Files

- **COMPLETE_DOCUMENTATION.md** - Full project overview & architecture
- **FRONTEND_GUIDE.md** - React components & state management
- **SETUP_AND_API_REFERENCE.md** - API reference with examples
- **PROJECT_DOCUMENTATION.md** - Original project documentation
- **This file** - Quick reference for developers

---

## 🚀 Deploy Checklist

- [ ] Set strong passwords in constants.php
- [ ] Enable HTTPS in production
- [ ] Implement JWT instead of simple tokens
- [ ] Add rate limiting to API endpoints
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Remove debug statements
- [ ] Optimize images
- [ ] Add API versioning
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring/alerting

---

## 💡 Pro Tips

1. **Use browser DevTools** - Check Network & Console tabs for debugging
2. **Test API first** - Use cURL before debugging frontend
3. **Check database** - Verify data exists before checking frontend
4. **Read error messages** - They usually tell you exactly what's wrong
5. **Comment WHY not WHAT** - Future you will thank present you
6. **Keep commits small** - Each commit should do one thing
7. **Use meaningful names** - `$user` not `$u`, `fetchDestinations()` not `fd()`
8. **Test with empty data** - Ensure app handles zero results gracefully

---

## 🎓 Learning Resources

### Frontend (React)
- useState & useEffect hooks: https://react.dev/reference/react/useState
- useMemo optimization: https://react.dev/reference/react/useMemo
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

### Backend (PHP)
- PDO database: https://www.php.net/manual/en/book.pdo.php
- Prepared statements: https://www.php.net/manual/en/pdo.prepared-statements.php
- Password hashing: https://www.php.net/manual/en/function.password-hash.php

### Database (MySQL)
- SELECT queries: https://dev.mysql.com/doc/refman/8.0/en/select.html
- Foreign keys: https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html
- Indexes: https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html

---

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Read COMPLETE_DOCUMENTATION.md
3. Check browser console for JavaScript errors
4. Check backend logs for PHP errors
5. Verify MySQL database has data

---

## ✅ Verification Checklist

- [ ] PHP server running on localhost:8000
- [ ] React app running on localhost:5173
- [ ] MySQL database "tripwise" exists
- [ ] All 6 tables created in database
- [ ] backend/config/constants.php configured
- [ ] Frontend pages load without errors
- [ ] API endpoints respond with data or empty arrays
- [ ] Authentication login/register working
- [ ] Token stored in localStorage after login

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: Production Ready for Local Development

Happy coding! 🎉
