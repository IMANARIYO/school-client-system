// School Management System - Client Application ERD
Table users {
  id int [pk, increment]                       // Primary key
  first_name varchar                            // User's first name
  last_name varchar                             // User's last name
  email varchar [unique]                        // Login email
  password_hash varchar                          // Hashed password (SHA-512)
  role varchar                                   // User role: STUDENT, PARENT, TEACHER, ADMIN
  phone varchar [null]                           // Optional phone number
  profile_picture varchar [null]                 // Optional URL for profile picture
  status varchar              // Account status: ACTIVE, INACTIVE, SUSPENDED
  last_login timestamp [null]                    // Last login timestamp
  created_at timestamp           // Account creation
  updated_at timestamp         // Last update
  deleted_at timestamp                   // Soft delete support
}

Table parents {
  id int [pk, increment]
  user_id int [ref: > users.id]
  phone varchar
}

Table students {
  id int [pk, increment]                     // Primary key
  user_id int [ref: > users.id]             // Link to authentication info
  parent_id int [ref: > parents.id]         // Parent reference
  class_id int [ref: > classes.id]          // Assigned class

  // Personal Info
  date_of_birth date                         // Student's birth date
  gender varchar                              // Male/Female/Other
  place_of_birth varchar [null]              // Optional

  // Enrollment Info
  enrollment_date date                        // When student joined
  enrollment_status varchar // ACTIVE, INACTIVE, GRADUATED, SUSPENDED
  roll_number varchar [unique, null]          // Optional unique student ID

  // Academic Info
  current_grade varchar [null]               // Current grade/level
  section varchar [null]                      // Section (A, B, etc.)
  previous_school varchar [null]             // Optional

  // Contact Info (specific to student, not parent)
  phone varchar [null]                        // Student phone number (if any)
  email varchar [null]                        // Optional school email

  // Optional extra info
  blood_group varchar [null]
  medical_conditions text [null]
  special_needs text [null]

  created_at timestamp
  updated_at timestamp 
  deleted_at timestamp [null]                // For soft deletes
}
Table teachers {
  id int [pk, increment]                     // Primary key
  user_id int [ref: > users.id]             // Link to authentication info

  // Personal Info
  date_of_birth date [null]
  gender varchar [null]
  address_line1 varchar [null]
  address_line2 varchar [null]
  city varchar [null]
  state varchar [null]
  postal_code varchar [null]
  country varchar [null]
  phone varchar [null]
  email varchar [null]
  emergency_contact_name varchar [null]
  emergency_contact_phone varchar [null]
  blood_group varchar [null]
  medical_conditions text [null]

  // Professional Info
  hire_date date [null]
  employment_type varchar [null]            // Full-time, Part-time, Contract
  specialization varchar [null]             // Subject expertise
  qualification varchar [null]              // Degree, certification
  years_of_experience int [null]
  subjects_can_teach text [null]           // Optional; link to teacher_subjects
  grade_levels_can_teach text [null]

  // Payroll / Banking Info
  bank_name varchar [null]
  bank_branch varchar [null]
  account_number varchar [null]            // Teacher’s account number
  account_type varchar [null]              // Savings, Current
  salary decimal [null]                     // Optional monthly salary
  tax_id varchar [null]                     // Optional for payroll reporting

  // Administrative Info
  staff_id varchar [unique, null]          // Internal staff number
  status varchar        // ACTIVE, INACTIVE, SUSPENDED, RETIRED
  created_at timestamp 
  updated_at timestamp 
  deleted_at timestamp [null]
}

Table subjects {
  id int [pk, increment]
  name varchar
  description varchar
}

Table classes {
  id int [pk, increment]                     // Primary key
  name varchar                                // Class name (e.g., "Class 1A")
  grade_level varchar                         // Grade level (e.g., 1, 2, 3...)
  section varchar [null]                      // Optional section (A, B, etc.)
  class_representative int [ref: > students.id, null] // Student leader
  responsible_teacher int [ref: > teachers.id, null]  // Class guardian/teacher
  capacity int [null]                          // Max number of students
  room_number varchar [null]                   // Classroom location
  notes text [null]                            // Optional description or remarks
  created_at timestamp 
  updated_at timestamp
  deleted_at timestamp [null]                  // Soft delete support
}
Table teacher_subjects {
  id int [pk, increment]
  teacher_id int [ref: > teachers.id]
  class_subject_id int [ref: > class_subjects.id]
}

Table class_subjects {
  id int [pk, increment]
  class_id int [ref: > classes.id]
  subject_id int [ref: > subjects.id]
}

Table schedules {
  id int [pk, increment]
  class_id int [ref: > classes.id]
  teacher_id int [ref: > teachers.id]
  subject_id int [ref: > subjects.id]
  day varchar
  start_time time
  end_time time
}

Table fee_accounts {
  id int [pk, increment]
  student_id int [ref: > students.id]
  balance decimal
  updated_at timestamp
}

Table transactions {
  id int [pk, increment]
  student_id int [ref: > students.id]
  amount decimal
  type varchar
  status varchar
  created_at timestamp
}
Table grades {
  id int [pk, increment]                     // Primary key
  student_id int [ref: > students.id]       // Which student
  teacher_id int [ref: > teachers.id]       // Who entered the grade
  class_subject_id int [ref: > class_subjects.id] // Which subject & class
  score decimal                              // Numeric score
  grade varchar [null]                        // Letter grade (A, B, C, etc.)
  term varchar                                // Term (Term 1, Term 2, Term 3)
  academic_year varchar                       // School year (2025/2026)
  exam_type varchar [null]                    // E.g., Midterm, Final, Quiz
  remarks text [null]                         // Optional teacher comments
  date_recorded timestamp  // When grade was entered
  approved_by int [ref: > teachers.id, null] // Optional, for head teacher/admin approval
  status varchar        // PENDING, APPROVED, REJECTED
  created_at timestamp 
  updated_at timestamp 
  deleted_at timestamp [null]                 // Soft delete
}
Table attendance {
  id int [pk, increment]
  student_id int [ref: > students.id]
  date date
  status varchar
}

Table devices {
  id int [pk, increment]
  user_id int [ref: > users.id]
  device_id varchar
  verified boolean
  created_at timestamp
}

Table notifications {
  id int [pk, increment]
  user_id int [ref: > users.id]
  title varchar
  message text
  type varchar
  is_read boolean
  created_at timestamp
}



Table addresses {
  id int [pk, increment]                     // Primary key
  parent_id int [ref: > parents.id]          // Link to parent
  address_line1 varchar                      // Street address
  address_line2 varchar [null]               // Optional apartment/suite
  city varchar
  state varchar [null]
  postal_code varchar [null]
  country varchar
  type varchar               // HOME, WORK, OTHER
  created_at timestamp 
  updated_at timestamp 
}