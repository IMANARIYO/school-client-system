# Teacher Management API - Updated with Subject IDs

## ✅ Convert User to Teacher (Updated)

### Endpoint
```
POST /api/v1/teachers/convert
```

### Request Body (Updated)
```json
{
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
  "subjectIds": [1, 2, 3],
  "gradeLevelsCanTeach": "9, 10, 11, 12",
  "salary": 50000.00,
  "staffId": "STAFF001"
}
```

### Key Changes
- ✅ **subjectIds** - Now accepts array of subject IDs instead of text
- ✅ System validates all subject IDs exist
- ✅ Automatically converts subject IDs to subject names for storage
- ✅ Example: `[1, 2, 3]` → "Mathematics, Physics, Chemistry"

### Response
```json
{
  "success": true,
  "message": "User converted to teacher successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "specialization": "Mathematics",
    "subjectsCanTeach": "Mathematics, Physics, Chemistry",
    "yearsOfExperience": 5,
    "salary": 50000.00,
    "status": "ACTIVE",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

## 📋 Complete Example

### Step 1: Create Subjects
```bash
POST /api/v1/subjects
{"name": "Mathematics", "description": "..."}
# Response: Subject ID = 1

POST /api/v1/subjects
{"name": "Physics", "description": "..."}
# Response: Subject ID = 2

POST /api/v1/subjects
{"name": "Chemistry", "description": "..."}
# Response: Subject ID = 3
```

### Step 2: Convert User to Teacher with Subject IDs
```bash
POST /api/v1/teachers/convert
{
  "userId": 5,
  "specialization": "Science",
  "qualification": "MSc in Physics",
  "hireDate": "2024-01-01",
  "employmentType": "FULL_TIME",
  "subjectIds": [1, 2, 3],
  "yearsOfExperience": 5,
  "salary": 60000.00,
  "staffId": "STAFF005"
}
```

### Result
- User role changed to TEACHER
- Teacher profile created
- Subjects validated and stored as: "Mathematics, Physics, Chemistry"

## 🔑 Key Features

### Subject ID Validation
- ✅ Validates each subject ID exists in database
- ✅ Throws error if any subject ID is invalid
- ✅ Converts IDs to subject names automatically
- ✅ Stores as comma-separated string in database

### Error Handling
```json
// If subject ID doesn't exist
{
  "success": false,
  "message": "Subject not found with id: 99",
  "data": null
}
```

## 🎯 Use Cases

### Use Case 1: Teacher with Multiple Subjects
```bash
POST /api/v1/teachers/convert
{
  "userId": 1,
  "specialization": "Science",
  "subjectIds": [1, 2, 3, 4],
  "hireDate": "2024-01-01"
}
# Result: Teacher can teach 4 subjects
```

### Use Case 2: Teacher with Single Subject
```bash
POST /api/v1/teachers/convert
{
  "userId": 2,
  "specialization": "Mathematics",
  "subjectIds": [1],
  "hireDate": "2024-01-01"
}
# Result: Teacher can teach only Mathematics
```

### Use Case 3: Teacher without Subjects (Optional)
```bash
POST /api/v1/teachers/convert
{
  "userId": 3,
  "specialization": "General",
  "hireDate": "2024-01-01"
}
# Result: Teacher created without subjects (can be added later)
```

## ✅ Updated Files

1. ✅ **CreateTeacherRequestDTO.java** - Changed `subjectsCanTeach` from String to `List<Long> subjectIds`
2. ✅ **TeacherServiceImpl.java** - Added subject ID validation and conversion logic
3. ✅ **TeacherSubjectRepository.java** - Created for future teacher-subject relationships

## 🔄 Data Flow

```
Input: subjectIds: [1, 2, 3]
    ↓
Validate: Check each ID exists in subjects table
    ↓
Fetch: Get subject names (Mathematics, Physics, Chemistry)
    ↓
Convert: Join names with ", "
    ↓
Store: Save as "Mathematics, Physics, Chemistry" in teacher.subjectsCanTeach
```

## 🎉 Complete!

The Teacher API now uses subject IDs instead of text, ensuring:
- ✅ Data integrity (only valid subjects)
- ✅ Referential integrity (subjects must exist)
- ✅ Easy validation
- ✅ Automatic name resolution
