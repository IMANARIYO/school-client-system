# Subjects Management API - Complete Documentation

## ✅ All Endpoints (7 Total)

### Basic CRUD Operations

1. **Create Subject**
   ```
   POST /api/v1/subjects
   
   Body:
   {
     "name": "Mathematics",
     "description": "Advanced mathematics covering algebra and calculus"
   }
   
   Response:
   {
     "success": true,
     "message": "Subject created successfully",
     "data": {
       "id": 1,
       "name": "Mathematics",
       "description": "Advanced mathematics covering algebra and calculus",
       "createdAt": "2024-01-01T10:00:00",
       "updatedAt": "2024-01-01T10:00:00"
     }
   }
   ```

2. **Get All Subjects** (Paginated + Search)
   ```
   GET /api/v1/subjects?search={query}&page={page}&size={size}
   
   Example: GET /api/v1/subjects?search=math&page=0&size=10
   
   Response:
   {
     "success": true,
     "message": "Subjects retrieved successfully",
     "data": {
       "content": [...subjects],
       "page": 0,
       "size": 10,
       "totalElements": 25,
       "totalPages": 3,
       "last": false
     }
   }
   ```

3. **Get Subject by ID**
   ```
   GET /api/v1/subjects/{id}
   
   Response:
   {
     "success": true,
     "message": "Subject retrieved successfully",
     "data": {
       "id": 1,
       "name": "Mathematics",
       "description": "...",
       "createdAt": "...",
       "updatedAt": "..."
     }
   }
   ```

4. **Update Subject**
   ```
   PUT /api/v1/subjects/{id}
   
   Body:
   {
     "name": "Advanced Mathematics",
     "description": "Updated description"
   }
   
   Response:
   {
     "success": true,
     "message": "Subject updated successfully",
     "data": {...}
   }
   ```

5. **Delete Subject** (Soft Delete)
   ```
   DELETE /api/v1/subjects/{id}
   
   Response:
   {
     "success": true,
     "message": "Subject deleted successfully",
     "data": null
   }
   ```

### Class-Subject Operations

6. ⭐ **Get Subjects by Class** (Paginated)
   ```
   GET /api/v1/subjects/class/{classId}?page={page}&size={size}
   
   Example: GET /api/v1/subjects/class/1?page=0&size=10
   
   Response:
   {
     "success": true,
     "message": "Subjects retrieved successfully",
     "data": {
       "content": [
         {
           "id": 1,
           "name": "Mathematics",
           "description": "...",
           "createdAt": "...",
           "updatedAt": "..."
         },
         {
           "id": 2,
           "name": "Physics",
           "description": "...",
           "createdAt": "...",
           "updatedAt": "..."
         }
       ],
       "page": 0,
       "size": 10,
       "totalElements": 8,
       "totalPages": 1,
       "last": true
     }
   }
   ```

7. ⭐ **Assign Subject to Class**
   ```
   POST /api/v1/subjects/{subjectId}/class/{classId}
   
   Example: POST /api/v1/subjects/1/class/5
   
   Response:
   {
     "success": true,
     "message": "Subject assigned to class successfully",
     "data": {
       "id": 1,
       "name": "Mathematics",
       "description": "...",
       "createdAt": "...",
       "updatedAt": "..."
     }
   }
   ```

## 📋 Complete Examples

### Create a Subject
```bash
curl -X POST http://localhost:8080/api/v1/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Mathematics",
    "description": "Advanced mathematics"
  }'
```

### Get All Subjects with Search
```bash
curl -X GET "http://localhost:8080/api/v1/subjects?search=math&page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Subjects Taught in a Class
```bash
curl -X GET "http://localhost:8080/api/v1/subjects/class/1?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Assign Subject to Class
```bash
curl -X POST http://localhost:8080/api/v1/subjects/1/class/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Subject
```bash
curl -X PUT http://localhost:8080/api/v1/subjects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Advanced Mathematics",
    "description": "Updated description"
  }'
```

### Delete Subject
```bash
curl -X DELETE http://localhost:8080/api/v1/subjects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Use Cases

### Use Case 1: Setup School Curriculum
```bash
# 1. Create subjects
POST /api/v1/subjects
{"name": "Mathematics", "description": "..."}

POST /api/v1/subjects
{"name": "Physics", "description": "..."}

POST /api/v1/subjects
{"name": "Chemistry", "description": "..."}

# 2. Assign subjects to class
POST /api/v1/subjects/1/class/1  # Math to Class 1
POST /api/v1/subjects/2/class/1  # Physics to Class 1
POST /api/v1/subjects/3/class/1  # Chemistry to Class 1
```

### Use Case 2: View Class Curriculum
```bash
# Get all subjects taught in Mathematics A (class ID 1)
GET /api/v1/subjects/class/1
```

### Use Case 3: Search for Subjects
```bash
# Search for subjects containing "math"
GET /api/v1/subjects?search=math&page=0&size=10
```

## 🔑 Key Features

### Pagination & Filtering
- ✅ All list endpoints support pagination
- ✅ Search by subject name
- ✅ Filter subjects by class
- ✅ Consistent paginated response format

### Soft Delete
- ✅ Subjects are marked as deleted (deletedAt timestamp)
- ✅ Not physically removed from database
- ✅ Can be restored if needed

### Class-Subject Relationship
- ✅ Many-to-many relationship via ClassSubject table
- ✅ One subject can be taught in multiple classes
- ✅ One class can have multiple subjects
- ✅ Prevents duplicate assignments

### Validation
- ✅ Subject name is required
- ✅ Validates subject exists before operations
- ✅ Validates class exists before assignment
- ✅ Prevents duplicate subject-class assignments

## 📊 Complete Workflow

### Setup Complete Curriculum

```bash
# Step 1: Create subjects
POST /api/v1/subjects
{
  "name": "Mathematics",
  "description": "Algebra, Geometry, Calculus"
}

POST /api/v1/subjects
{
  "name": "Physics",
  "description": "Mechanics, Thermodynamics, Optics"
}

POST /api/v1/subjects
{
  "name": "Chemistry",
  "description": "Organic, Inorganic, Physical Chemistry"
}

# Step 2: Create a class (if not exists)
POST /api/v1/classes
{
  "name": "Grade 10 - Section A",
  "gradeLevel": "10",
  "section": "A",
  "capacity": 40
}

# Step 3: Assign subjects to class
POST /api/v1/subjects/1/class/1  # Mathematics
POST /api/v1/subjects/2/class/1  # Physics
POST /api/v1/subjects/3/class/1  # Chemistry

# Step 4: View class curriculum
GET /api/v1/subjects/class/1

# Step 5: Search for specific subject
GET /api/v1/subjects?search=physics
```

## ✅ Files Created

### DTOs:
1. ✅ **SubjectRequestDTO.java** - Request DTO with validation
2. ✅ **SubjectResponseDTO.java** - Response DTO

### Repositories:
3. ✅ **SubjectRepository.java** - JPA repository with queries
4. ✅ **ClassSubjectRepository.java** - Junction table repository

### Mappers:
5. ✅ **SubjectMapper.java** - Entity/DTO mapping

### Services:
6. ✅ **SubjectService.java** - Service interface
7. ✅ **SubjectServiceImpl.java** - Service implementation

### Controllers:
8. ✅ **SubjectController.java** - REST endpoints

## 🔐 Security Recommendations

```java
// SubjectController.java

@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<...> createSubject(...)

@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{subjectId}/class/{classId}")
public ResponseEntity<...> assignSubjectToClass(...)

@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
@GetMapping
public ResponseEntity<...> getAllSubjects(...)

@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
@GetMapping("/class/{classId}")
public ResponseEntity<...> getSubjectsByClassId(...)
```

## 📈 API Summary

### Total Endpoints: 7

**CRUD Operations:**
- ✅ POST /api/v1/subjects - Create subject
- ✅ GET /api/v1/subjects - List all subjects (paginated + search)
- ✅ GET /api/v1/subjects/{id} - Get subject by ID
- ✅ PUT /api/v1/subjects/{id} - Update subject
- ✅ DELETE /api/v1/subjects/{id} - Delete subject

**Class-Subject Operations:**
- ✅ GET /api/v1/subjects/class/{classId} - Get subjects by class (paginated)
- ✅ POST /api/v1/subjects/{subjectId}/class/{classId} - Assign subject to class

## 🎉 Complete!

The Subjects Management API is fully implemented with:
- ✅ Full CRUD operations
- ✅ Pagination on all list endpoints
- ✅ Search functionality
- ✅ Filter subjects by class
- ✅ Assign subjects to classes
- ✅ Soft delete
- ✅ Validation
- ✅ Swagger documentation
- ✅ Consistent response format
