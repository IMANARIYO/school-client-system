# Teacher Management API - Convert User to Teacher

## ✅ Endpoint

### Convert User to Teacher
```
POST /api/v1/teachers/convert
```

## 📋 Description

This endpoint converts an existing user account into a teacher account by:
1. Taking the user ID
2. Filling in teacher-specific fields
3. Changing the user's role from their current role to TEACHER
4. Creating a teacher profile linked to the user

## 🔑 Request

### Endpoint
```
POST /api/v1/teachers/convert
```

### Request Body
```json
{
  "userId": 1,
  "dateOfBirth": "1985-05-15",
  "gender": "Male",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "email": "teacher@school.com",
  "emergencyContactName": "John Doe",
  "emergencyContactPhone": "+1234567891",
  "bloodGroup": "O+",
  "medicalConditions": "None",
  "hireDate": "2024-01-01",
  "employmentType": "FULL_TIME",
  "specialization": "Mathematics",
  "qualification": "MSc in Mathematics",
  "yearsOfExperience": 5,
  "subjectsCanTeach": "Mathematics, Physics",
  "gradeLevelsCanTeach": "9, 10, 11, 12",
  "bankName": "Bank of America",
  "bankBranch": "Main Branch",
  "accountNumber": "1234567890",
  "accountType": "SAVINGS",
  "salary": 50000.00,
  "taxId": "123-45-6789",
  "staffId": "STAFF001"
}
```

### Required Fields
- `userId` - The ID of the user to convert to teacher

### Optional Fields
All other fields are optional and can be filled in as needed.

## 📤 Response

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User converted to teacher successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "teacher@school.com",
    "phone": "+1234567890",
    "dateOfBirth": "1985-05-15",
    "gender": "Male",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "emergencyContactName": "John Doe",
    "emergencyContactPhone": "+1234567891",
    "bloodGroup": "O+",
    "medicalConditions": "None",
    "hireDate": "2024-01-01",
    "employmentType": "FULL_TIME",
    "specialization": "Mathematics",
    "qualification": "MSc in Mathematics",
    "yearsOfExperience": 5,
    "subjectsCanTeach": "Mathematics, Physics",
    "gradeLevelsCanTeach": "9, 10, 11, 12",
    "bankName": "Bank of America",
    "bankBranch": "Main Branch",
    "accountNumber": "1234567890",
    "accountType": "SAVINGS",
    "salary": 50000.00,
    "taxId": "123-45-6789",
    "staffId": "STAFF001",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### Error Responses

**User Not Found (404)**
```json
{
  "success": false,
  "message": "User not found with id: 1",
  "data": null
}
```

**User Already a Teacher (400)**
```json
{
  "success": false,
  "message": "User is already a teacher",
  "data": null
}
```

## 🎯 Use Cases

### Use Case 1: Convert New User to Teacher
```bash
# Step 1: User signs up
POST /api/v1/users/signup
{
  "email": "newteacher@school.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "SecurePass123",
  "role": "STUDENT"  # Initial role
}

# Response: User created with ID 5

# Step 2: Admin converts user to teacher
POST /api/v1/teachers/convert
{
  "userId": 5,
  "specialization": "Physics",
  "qualification": "PhD in Physics",
  "hireDate": "2024-01-15",
  "employmentType": "FULL_TIME",
  "salary": 60000.00,
  "staffId": "STAFF005"
}

# Result: User role changed to TEACHER, teacher profile created
```

### Use Case 2: Minimal Teacher Conversion
```bash
# Convert user with minimal information
POST /api/v1/teachers/convert
{
  "userId": 10,
  "hireDate": "2024-01-20",
  "specialization": "Chemistry"
}

# Other fields can be updated later
```

## 📋 Complete Example

### Using cURL
```bash
curl -X POST http://localhost:8080/api/v1/teachers/convert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "userId": 1,
    "dateOfBirth": "1985-05-15",
    "gender": "Male",
    "phone": "+1234567890",
    "email": "teacher@school.com",
    "hireDate": "2024-01-01",
    "employmentType": "FULL_TIME",
    "specialization": "Mathematics",
    "qualification": "MSc in Mathematics",
    "yearsOfExperience": 5,
    "subjectsCanTeach": "Mathematics, Physics",
    "gradeLevelsCanTeach": "9, 10, 11, 12",
    "salary": 50000.00,
    "staffId": "STAFF001"
  }'
```

## 🔒 What Happens

1. **Validates User Exists** - Checks if user ID exists
2. **Checks Not Already Teacher** - Prevents duplicate teacher profiles
3. **Creates Teacher Profile** - Saves all teacher-specific information
4. **Changes User Role** - Updates user.role from current role to TEACHER
5. **Links User to Teacher** - Creates relationship between User and Teacher entities
6. **Returns Teacher Data** - Returns complete teacher profile

## ⚠️ Important Notes

### Role Change
- User's role is automatically changed to TEACHER
- Previous role is overwritten
- User will have TEACHER permissions after conversion

### Validation
- User must exist in the system
- User cannot already be a teacher
- Only userId is required, other fields are optional

### Data Integrity
- Teacher profile is linked to user via foreign key
- One user can only have one teacher profile
- Deleting user will affect teacher profile (cascade rules apply)

## ✅ Files Created

1. ✅ **CreateTeacherRequestDTO.java** - Request DTO with all teacher fields
2. ✅ **TeacherResponseDTO.java** - Response DTO
3. ✅ **TeacherMapper.java** - Entity/DTO mapping
4. ✅ **TeacherService.java** - Service interface
5. ✅ **TeacherServiceImpl.java** - Implementation with role change logic
6. ✅ **TeacherController.java** - REST endpoint
7. ✅ **TeacherRepository.java** - Updated with findByUserId method

## 🔐 Security Recommendations

```java
// Only ADMIN should be able to convert users to teachers
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/convert")
public ResponseEntity<...> convertUserToTeacher(...)
```

## 🎉 Complete!

The Teacher conversion API is ready to use. Users can now be converted to teachers with full profile information and automatic role change.

### Workflow Summary:
1. User signs up → Gets basic user account
2. Admin converts user to teacher → Fills teacher details
3. System changes role to TEACHER → User now has teacher permissions
4. Teacher can now be assigned to classes and subjects
