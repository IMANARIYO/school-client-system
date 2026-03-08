# Classes Management API - Complete Documentation

## ✅ All Endpoints

### 1. Create Class
```
POST /api/v1/classes
```

### 2. Get All Classes (Paginated + Search)
```
GET /api/v1/classes?search={query}&page={page}&size={size}
```

### 3. Get Class by ID
```
GET /api/v1/classes/{id}
```

### 4. Update Class
```
PUT /api/v1/classes/{id}
```

### 5. Delete Class
```
DELETE /api/v1/classes/{id}
```

### 6. ⭐ Assign Students to Class (NEW)
```
POST /api/v1/classes/{classId}/students

Request Body:
{
  "classId": 1,
  "studentIds": [1, 2, 3, 4, 5]
}

Response:
{
  "success": true,
  "message": "Students assigned to class successfully",
  "data": {
    "id": 1,
    "name": "Mathematics A",
    "gradeLevel": "10",
    ...
  }
}
```

### 7. ⭐ Assign Teacher to Class (NEW)
```
POST /api/v1/classes/{classId}/teacher

Request Body:
{
  "teacherId": 1
}

Response:
{
  "success": true,
  "message": "Teacher assigned to class successfully",
  "data": {
    "id": 1,
    "name": "Mathematics A",
    "responsibleTeacherId": 1,
    "responsibleTeacherName": "Jane Smith",
    ...
  }
}
```

## 📋 Complete API Examples

### Assign Multiple Students to a Class
```bash
curl -X POST http://localhost:8080/api/v1/classes/1/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "classId": 1,
    "studentIds": [1, 2, 3, 4, 5]
  }'
```

### Assign Teacher to a Class
```bash
curl -X POST http://localhost:8080/api/v1/classes/1/teacher \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "teacherId": 1
  }'
```

## 🔑 Key Features

### Assignment APIs
1. **Assign Students** - Bulk assign multiple students to a class
   - Updates each student's `schoolClass` field
   - Validates all student IDs exist
   - Returns updated class information

2. **Assign Teacher** - Assign responsible teacher to a class
   - Updates class's `responsibleTeacher` field
   - Validates teacher ID exists
   - Returns updated class information

## 📊 DTOs Created

### AssignStudentsRequestDTO
```java
{
  "classId": Long (required),
  "studentIds": List<Long> (required, not empty)
}
```

### AssignTeacherRequestDTO
```java
{
  "teacherId": Long (required)
}
```

## ✅ Implementation Summary

### Files Created/Updated:
1. ✅ **AssignStudentsRequestDTO.java** - DTO for student assignment
2. ✅ **AssignTeacherRequestDTO.java** - DTO for teacher assignment
3. ✅ **ClassService.java** - Added 2 new methods
4. ✅ **ClassServiceImpl.java** - Implemented assignment logic
5. ✅ **ClassController.java** - Added 2 new endpoints

### Total Endpoints: 7
- ✅ POST /api/v1/classes - Create
- ✅ GET /api/v1/classes - List all
- ✅ GET /api/v1/classes/{id} - Get one
- ✅ PUT /api/v1/classes/{id} - Update
- ✅ DELETE /api/v1/classes/{id} - Delete
- ✅ POST /api/v1/classes/{classId}/students - Assign students
- ✅ POST /api/v1/classes/{classId}/teacher - Assign teacher

## 🧪 Testing Workflow

### Complete Class Setup Flow:

1. **Create a Class**
```bash
POST /api/v1/classes
{
  "name": "Mathematics A",
  "gradeLevel": "10",
  "section": "A",
  "capacity": 40,
  "roomNumber": "101"
}
```

2. **Assign Teacher to Class**
```bash
POST /api/v1/classes/1/teacher
{
  "teacherId": 5
}
```

3. **Assign Students to Class**
```bash
POST /api/v1/classes/1/students
{
  "classId": 1,
  "studentIds": [10, 11, 12, 13, 14, 15]
}
```

4. **Verify Class Setup**
```bash
GET /api/v1/classes/1
```

## 🔒 Security Recommendations

Add these annotations to ClassController methods:

```java
// Only ADMIN can create/update/delete classes
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<...> createClass(...)

// Only ADMIN can assign students/teachers
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{classId}/students")
public ResponseEntity<...> assignStudentsToClass(...)

// ADMIN and TEACHER can view classes
@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
@GetMapping
public ResponseEntity<...> getAllClasses(...)
```

## ✨ Complete!

The Classes Management API now has full CRUD operations plus:
- ✅ Assign multiple students to a class
- ✅ Assign responsible teacher to a class
- ✅ Proper validation
- ✅ Error handling
- ✅ Consistent response format
