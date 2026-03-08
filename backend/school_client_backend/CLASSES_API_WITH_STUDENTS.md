# Classes Management API - Complete with Student Listing

## ✅ All Endpoints (10 Total)

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
   ```

7. **Assign Teacher to Class**
   ```
   POST /api/v1/classes/{classId}/teacher
   ```

8. **Add Single Student to Class**
   ```
   POST /api/v1/classes/{classId}/student/{studentId}
   ```

9. **Set Class Representative**
   ```
   PATCH /api/v1/classes/{classId}/representative/{studentId}
   ```

10. ⭐ **Get Students in Class** (NEW)
    ```
    GET /api/v1/classes/{classId}/students
    
    Example: GET /api/v1/classes/1/students
    
    Response:
    {
      "success": true,
      "message": "Students retrieved successfully",
      "data": [
        {
          "id": 1,
          "userId": 10,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@school.com",
          "phone": "+1234567890",
          "rollNumber": "2024001",
          "gender": "Male",
          "dateOfBirth": "2008-05-15",
          "enrollmentDate": "2024-01-10",
          "enrollmentStatus": "ACTIVE",
          "classId": 1,
          "className": "Mathematics A"
        },
        {
          "id": 2,
          "userId": 11,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@school.com",
          "phone": "+1234567891",
          "rollNumber": "2024002",
          "gender": "Female",
          "dateOfBirth": "2008-07-20",
          "enrollmentDate": "2024-01-10",
          "enrollmentStatus": "ACTIVE",
          "classId": 1,
          "className": "Mathematics A"
        }
      ]
    }
    ```

## 📋 Complete Examples

### Get All Students in a Class
```bash
curl -X GET http://localhost:8080/api/v1/classes/1/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response Structure
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 10,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@school.com",
      "phone": "+1234567890",
      "rollNumber": "2024001",
      "gender": "Male",
      "dateOfBirth": "2008-05-15",
      "enrollmentDate": "2024-01-10",
      "enrollmentStatus": "ACTIVE",
      "classId": 1,
      "className": "Mathematics A"
    }
  ]
}
```

## 🎯 Use Cases

### Use Case 1: View Class Roster
```bash
# Get all students in Mathematics A (class ID 1)
GET /api/v1/classes/1/students
```

### Use Case 2: Check Class Size Before Adding Student
```bash
# 1. Get class details (check capacity)
GET /api/v1/classes/1

# 2. Get current students (check current count)
GET /api/v1/classes/1/students

# 3. Add student if space available
POST /api/v1/classes/1/student/25
```

### Use Case 3: Select Class Representative
```bash
# 1. Get all students in class
GET /api/v1/classes/1/students

# 2. Choose a student from the list
# 3. Set as representative
PATCH /api/v1/classes/1/representative/5
```

## 🔑 Key Features

### Student Listing
- ✅ Returns all active students in a class
- ✅ Excludes soft-deleted students
- ✅ Includes student details (name, email, roll number, etc.)
- ✅ Shows class information for each student
- ✅ Validates class exists before querying

### Student Response Fields
- `id` - Student ID
- `userId` - Associated user ID
- `firstName` - Student first name
- `lastName` - Student last name
- `email` - Student email
- `phone` - Student phone
- `rollNumber` - Student roll number
- `gender` - Student gender
- `dateOfBirth` - Date of birth
- `enrollmentDate` - Enrollment date
- `enrollmentStatus` - Current status (ACTIVE, INACTIVE, etc.)
- `classId` - Class ID
- `className` - Class name

## 📊 Complete Workflow

### Setup a Class with Students

```bash
# 1. Create class
POST /api/v1/classes
{
  "name": "Mathematics A",
  "gradeLevel": "10",
  "section": "A",
  "capacity": 40,
  "roomNumber": "101"
}

# 2. Assign teacher
POST /api/v1/classes/1/teacher
{
  "teacherId": 5
}

# 3. Add students
POST /api/v1/classes/1/students
{
  "classId": 1,
  "studentIds": [10, 11, 12, 13, 14]
}

# 4. View all students in class
GET /api/v1/classes/1/students

# 5. Set class representative (from the list)
PATCH /api/v1/classes/1/representative/10

# 6. Verify final setup
GET /api/v1/classes/1
```

## ✅ Files Created/Updated

### New Files:
1. ✅ **StudentResponseDTO.java** - DTO for student data
2. ✅ **StudentMapper.java** - Maps Student entity to DTO

### Updated Files:
3. ✅ **StudentRepository.java** - Added `findByClassId()` method
4. ✅ **ClassService.java** - Added `getStudentsByClassId()` method
5. ✅ **ClassServiceImpl.java** - Implemented student listing logic
6. ✅ **ClassController.java** - Added GET endpoint

## 🎉 Complete API Summary

### Total Endpoints: 10

**CRUD Operations:**
- ✅ POST /api/v1/classes - Create class
- ✅ GET /api/v1/classes - List all classes
- ✅ GET /api/v1/classes/{id} - Get class details
- ✅ PUT /api/v1/classes/{id} - Update class
- ✅ DELETE /api/v1/classes/{id} - Delete class

**Student Management:**
- ✅ POST /api/v1/classes/{classId}/students - Assign multiple students
- ✅ POST /api/v1/classes/{classId}/student/{studentId} - Add single student
- ✅ GET /api/v1/classes/{classId}/students - **List students in class** ⭐
- ✅ PATCH /api/v1/classes/{classId}/representative/{studentId} - Set representative

**Teacher Management:**
- ✅ POST /api/v1/classes/{classId}/teacher - Assign teacher

## 🔐 Security Recommendations

```java
// Teachers and admins can view students
@PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
@GetMapping("/{classId}/students")
public ResponseEntity<...> getStudentsByClassId(...)

// Only admins can add/remove students
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{classId}/student/{studentId}")
public ResponseEntity<...> addStudentToClass(...)
```

## 🎊 Ready to Use!

The Classes Management API is now complete with full student listing functionality!
