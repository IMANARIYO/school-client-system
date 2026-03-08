# Classes Management API - Final Complete Documentation

## ✅ All Endpoints (9 Total)

### Basic CRUD Operations

1. **Create Class**
   ```
   POST /api/v1/classes
   ```

2. **Get All Classes** (Paginated + Search)
   ```
   GET /api/v1/classes?search={query}&page={page}&size={size}
   ```

3. **Get Class by ID**
   ```
   GET /api/v1/classes/{id}
   ```

4. **Update Class**
   ```
   PUT /api/v1/classes/{id}
   ```

5. **Delete Class** (Soft Delete)
   ```
   DELETE /api/v1/classes/{id}
   ```

### Assignment Operations

6. **Assign Multiple Students to Class**
   ```
   POST /api/v1/classes/{classId}/students
   
   Body:
   {
     "classId": 1,
     "studentIds": [1, 2, 3, 4, 5]
   }
   ```

7. **Assign Teacher to Class**
   ```
   POST /api/v1/classes/{classId}/teacher
   
   Body:
   {
     "teacherId": 1
   }
   ```

8. ⭐ **Add Single Student to Class** (NEW)
   ```
   POST /api/v1/classes/{classId}/student/{studentId}
   
   Example: POST /api/v1/classes/1/student/5
   
   Response:
   {
     "success": true,
     "message": "Student added to class successfully",
     "data": {...}
   }
   ```

9. ⭐ **Set Class Representative** (NEW)
   ```
   PATCH /api/v1/classes/{classId}/representative/{studentId}
   
   Example: PATCH /api/v1/classes/1/representative/5
   
   Response:
   {
     "success": true,
     "message": "Class representative set successfully",
     "data": {...}
   }
   
   Note: Student MUST already be in the class!
   ```

## 🔒 Validation Rules

### Class Representative Validation
- ✅ Student must exist
- ✅ Student must be enrolled in the class
- ❌ Cannot set a student from another class as representative
- ❌ Cannot set a student not yet assigned to any class

### Example Error Response
```json
{
  "success": false,
  "message": "Class representative must be a student in this class",
  "data": null
}
```

## 📋 Complete Workflow Example

### Step 1: Create a Class
```bash
curl -X POST http://localhost:8080/api/v1/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Mathematics A",
    "gradeLevel": "10",
    "section": "A",
    "capacity": 40,
    "roomNumber": "101"
  }'
```

### Step 2: Assign Teacher
```bash
curl -X POST http://localhost:8080/api/v1/classes/1/teacher \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "teacherId": 5
  }'
```

### Step 3: Add Students (Option A - Bulk)
```bash
curl -X POST http://localhost:8080/api/v1/classes/1/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "classId": 1,
    "studentIds": [10, 11, 12, 13, 14]
  }'
```

### Step 3: Add Students (Option B - One by One)
```bash
curl -X POST http://localhost:8080/api/v1/classes/1/student/10 \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:8080/api/v1/classes/1/student/11 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Set Class Representative
```bash
# Student 10 is already in class 1, so we can set them as representative
curl -X PATCH http://localhost:8080/api/v1/classes/1/representative/10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Verify Setup
```bash
curl -X GET http://localhost:8080/api/v1/classes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Use Cases

### Use Case 1: Add New Student to Existing Class
```bash
POST /api/v1/classes/1/student/25
```

### Use Case 2: Change Class Representative
```bash
# First, ensure new student is in the class
POST /api/v1/classes/1/student/30

# Then set as representative
PATCH /api/v1/classes/1/representative/30
```

### Use Case 3: Bulk Student Assignment
```bash
POST /api/v1/classes/1/students
{
  "classId": 1,
  "studentIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

## ⚠️ Important Notes

1. **Class Representative Validation**
   - Always add student to class BEFORE setting as representative
   - System validates student belongs to the class
   - Prevents cross-class representative assignments

2. **Single vs Bulk Student Assignment**
   - Use single endpoint for adding one student at a time
   - Use bulk endpoint for initial class setup or mass transfers
   - Both update the student's `schoolClass` field

3. **Soft Delete**
   - Deleted classes are marked with `deletedAt` timestamp
   - Not physically removed from database
   - Can be restored if needed

## 🔐 Security Recommendations

```java
// ClassController.java

@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<...> createClass(...)

@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{classId}/student/{studentId}")
public ResponseEntity<...> addStudentToClass(...)

@PreAuthorize("hasRole('ADMIN')")
@PatchMapping("/{classId}/representative/{studentId}")
public ResponseEntity<...> setClassRepresentative(...)

@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
@GetMapping
public ResponseEntity<...> getAllClasses(...)
```

## ✅ Complete Implementation

### Files Created/Updated:
1. ✅ ClassRequestDTO.java
2. ✅ ClassResponseDTO.java
3. ✅ AssignStudentsRequestDTO.java
4. ✅ AssignTeacherRequestDTO.java
5. ✅ ClassRepository.java
6. ✅ ClassMapper.java
7. ✅ ClassService.java (4 methods)
8. ✅ ClassServiceImpl.java (4 implementations + validation)
9. ✅ ClassController.java (9 endpoints)
10. ✅ StudentRepository.java
11. ✅ TeacherRepository.java

### Total Endpoints: 9
- ✅ POST /api/v1/classes - Create
- ✅ GET /api/v1/classes - List all
- ✅ GET /api/v1/classes/{id} - Get one
- ✅ PUT /api/v1/classes/{id} - Update
- ✅ DELETE /api/v1/classes/{id} - Delete
- ✅ POST /api/v1/classes/{classId}/students - Assign multiple students
- ✅ POST /api/v1/classes/{classId}/teacher - Assign teacher
- ✅ POST /api/v1/classes/{classId}/student/{studentId} - Add single student ⭐
- ✅ PATCH /api/v1/classes/{classId}/representative/{studentId} - Set representative ⭐

## 🎉 Ready to Use!

The Classes Management API is complete with:
- ✅ Full CRUD operations
- ✅ Bulk and single student assignment
- ✅ Teacher assignment
- ✅ Class representative with validation
- ✅ Search and pagination
- ✅ Soft delete
- ✅ Proper error handling
- ✅ Swagger documentation
