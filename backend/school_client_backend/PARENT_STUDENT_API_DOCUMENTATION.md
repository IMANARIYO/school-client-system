# Parent & Student Management API - Complete Documentation

## ✅ Parent Endpoints (2 Total)

### 1. Convert User to Parent
```
POST /api/v1/parents/convert
```

**Request Body:**
```json
{
  "userId": 1,
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User converted to parent successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "parent@school.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### 2. Get Students by Parent
```
GET /api/v1/parents/{parentId}/students
```

**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 5,
      "firstName": "Alice",
      "lastName": "Doe",
      "email": "alice@school.com",
      "phone": "+1234567891",
      "rollNumber": "2024001",
      "gender": "Female",
      "dateOfBirth": "2010-05-15",
      "enrollmentDate": "2024-01-01",
      "enrollmentStatus": "ACTIVE",
      "classId": 1,
      "className": "Grade 10 - Section A"
    }
  ]
}
```

## ✅ Student Endpoints (1 Total)

### 1. Convert User to Student
```
POST /api/v1/students/convert
```

**Request Body:**
```json
{
  "userId": 5,
  "parentId": 1,
  "classId": 1,
  "dateOfBirth": "2010-05-15",
  "gender": "Male",
  "placeOfBirth": "New York",
  "enrollmentDate": "2024-01-01",
  "rollNumber": "2024001",
  "currentGrade": "10",
  "section": "A",
  "previousSchool": "ABC School",
  "phone": "+1234567891",
  "email": "student@school.com",
  "bloodGroup": "O+",
  "medicalConditions": "None",
  "specialNeeds": "None"
}
```

**Required Fields:**
- userId
- parentId
- classId
- dateOfBirth
- gender
- enrollmentDate

**Response:**
```json
{
  "success": true,
  "message": "User converted to student successfully",
  "data": {
    "id": 1,
    "userId": 5,
    "firstName": "Alice",
    "lastName": "Doe",
    "email": "student@school.com",
    "phone": "+1234567891",
    "rollNumber": "2024001",
    "gender": "Male",
    "dateOfBirth": "2010-05-15",
    "enrollmentDate": "2024-01-01",
    "enrollmentStatus": "ACTIVE",
    "classId": 1,
    "className": "Grade 10 - Section A"
  }
}
```

## 📋 Complete Workflow Examples

### Workflow 1: Create Parent and Add Student

```bash
# Step 1: User signs up (parent)
POST /api/v1/users/signup
{
  "email": "parent@school.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123",
  "role": "STUDENT"  # Initial role
}
# Response: User ID = 1

# Step 2: Convert user to parent
POST /api/v1/parents/convert
{
  "userId": 1,
  "phone": "+1234567890"
}
# Response: Parent ID = 1, User role changed to PARENT

# Step 3: User signs up (student)
POST /api/v1/users/signup
{
  "email": "student@school.com",
  "firstName": "Alice",
  "lastName": "Doe",
  "password": "SecurePass123",
  "role": "STUDENT"
}
# Response: User ID = 5

# Step 4: Convert user to student and link to parent
POST /api/v1/students/convert
{
  "userId": 5,
  "parentId": 1,
  "classId": 1,
  "dateOfBirth": "2010-05-15",
  "gender": "Female",
  "enrollmentDate": "2024-01-01",
  "rollNumber": "2024001"
}
# Response: Student created, linked to parent, assigned to class

# Step 5: View parent's children
GET /api/v1/parents/1/students
# Response: List of all students (children) of this parent
```

### Workflow 2: Add Multiple Students to Same Parent

```bash
# Parent already exists (ID = 1)

# Add first child
POST /api/v1/students/convert
{
  "userId": 10,
  "parentId": 1,
  "classId": 1,
  "dateOfBirth": "2010-05-15",
  "gender": "Male",
  "enrollmentDate": "2024-01-01",
  "rollNumber": "2024001"
}

# Add second child
POST /api/v1/students/convert
{
  "userId": 11,
  "parentId": 1,
  "classId": 2,
  "dateOfBirth": "2012-08-20",
  "gender": "Female",
  "enrollmentDate": "2024-01-01",
  "rollNumber": "2024002"
}

# View all children
GET /api/v1/parents/1/students
# Returns both students
```

## 🎯 Use Cases

### Use Case 1: Parent Registration
```bash
# 1. Parent signs up
POST /api/v1/users/signup

# 2. Admin converts to parent
POST /api/v1/parents/convert
{
  "userId": 1,
  "phone": "+1234567890"
}
```

### Use Case 2: Student Enrollment
```bash
# 1. Student signs up
POST /api/v1/users/signup

# 2. Admin converts to student and assigns parent + class
POST /api/v1/students/convert
{
  "userId": 5,
  "parentId": 1,
  "classId": 1,
  "dateOfBirth": "2010-05-15",
  "gender": "Male",
  "enrollmentDate": "2024-01-01"
}
```

### Use Case 3: View Parent's Children
```bash
GET /api/v1/parents/1/students
```

## 🔑 Key Features

### Parent Management
- ✅ Convert user to parent
- ✅ Change user role to PARENT
- ✅ View all children of a parent
- ✅ Validates user exists
- ✅ Prevents duplicate parent profiles

### Student Management
- ✅ Convert user to student
- ✅ Change user role to STUDENT
- ✅ Link student to parent
- ✅ Assign student to class
- ✅ Validates user, parent, and class exist
- ✅ Prevents duplicate student profiles

### Relationships
- ✅ Parent → Student (One-to-Many)
- ✅ Student → Parent (Many-to-One)
- ✅ Student → Class (Many-to-One)
- ✅ Student → User (One-to-One)

## ✅ Files Created

### DTOs:
1. ✅ **CreateParentRequestDTO.java**
2. ✅ **ParentResponseDTO.java**
3. ✅ **CreateStudentRequestDTO.java**

### Repositories:
4. ✅ **ParentRepository.java**
5. ✅ **StudentRepository.java** (updated)

### Mappers:
6. ✅ **ParentMapper.java**
7. ✅ **StudentMapper.java** (updated)

### Services:
8. ✅ **ParentService.java**
9. ✅ **ParentServiceImpl.java**
10. ✅ **StudentService.java**
11. ✅ **StudentServiceImpl.java**

### Controllers:
12. ✅ **ParentController.java**
13. ✅ **StudentController.java**

## 🔐 Security Recommendations

```java
// Only ADMIN can convert users
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/convert")
public ResponseEntity<...> convertUserToParent(...)

@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/convert")
public ResponseEntity<...> convertUserToStudent(...)

// Parents can view their own children
@PreAuthorize("hasAnyRole('ADMIN', 'PARENT')")
@GetMapping("/{parentId}/students")
public ResponseEntity<...> getStudentsByParentId(...)
```

## 📊 API Summary

### Parent Endpoints: 2
- ✅ POST /api/v1/parents/convert - Convert user to parent
- ✅ GET /api/v1/parents/{parentId}/students - Get parent's children

### Student Endpoints: 1
- ✅ POST /api/v1/students/convert - Convert user to student

## 🎉 Complete!

The Parent and Student management APIs are fully implemented with:
- ✅ Convert users to parents
- ✅ Convert users to students
- ✅ Link students to parents
- ✅ Assign students to classes
- ✅ View parent's children
- ✅ Automatic role changes
- ✅ Full validation
- ✅ Proper relationships

### Complete User Journey:
1. User signs up → Basic user account
2. Admin converts to parent → Parent profile + PARENT role
3. Another user signs up → Basic user account
4. Admin converts to student → Student profile + STUDENT role + linked to parent + assigned to class
5. Parent can view their children → GET /api/v1/parents/{id}/students
