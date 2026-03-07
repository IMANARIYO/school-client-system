Enum UserRole {
  patient
  doctor
  hr
  labtech
  regulator
  admin
}

Enum OrganizationType {
  employer
  lab
  regulator
  partner
}

Enum InsuranceCoverageType {
  full
  partial
}

Enum ScreeningPackageType {
  basic
  executive
  food_handler
  custom
}

Enum AppointmentLocationType {
  home
  office
  mobile_clinic
}

Enum AppointmentStatus {
  scheduled
  completed
  canceled
}

Enum PaymentType {
  self
  organization
  insurance
}

Enum PaymentStatus {
  pending
  paid
  failed
}

Enum ConsentViewerRole {
  employer
  insurer
  regulator
}

Enum SampleStatus {
  collected
  in_transit
  in_lab
  completed
}

Enum PrescriptionDeliveryOption {
  pickup
  home_delivery
}

Enum NotificationType {
  sms
  push
}

Enum NotificationStatus {
  sent
  failed
}

Table user {
  id varchar [pk]
  slug varchar [unique, note: 'Public-safe ID']
  name varchar
  email varchar
  phone varchar
  password varchar
  role UserRole
  insurance_id varchar [ref: > insurance.id]
  organization_id varchar [ref: > organization.id]
  created_at datetime
}

Table organization {
  id varchar [pk]
  slug varchar [unique]
  name varchar
  type OrganizationType
  contact_person varchar
  address text
}

Table insurance {
  id varchar [pk]
  slug varchar [unique]
  provider_name varchar
  coverage_type InsuranceCoverageType
  policy_number varchar
}

Table screening_package {
  id varchar [pk]
  slug varchar [unique]
  name varchar
  description text
  price decimal
  type ScreeningPackageType
}

Table appointment {
  id varchar [pk]
  slug varchar [unique]
  user_id varchar [ref: > user.id]
  package_id varchar [ref: > screening_package.id]
  scheduled_date datetime
  location_type AppointmentLocationType
  status AppointmentStatus
}

Table payment {
  id varchar [pk]
  user_id varchar [ref: > user.id]
  appointment_id varchar [ref: > appointment.id]
  insurance_id varchar [ref: > insurance.id]
  amount_paid decimal
  payment_type PaymentType
  balance_due decimal
  status PaymentStatus
}

Table consent {
  id varchar [pk]
  user_id varchar [ref: > user.id]
  viewer_role ConsentViewerRole
  viewer_id varchar [ref: > organization.id]
  given boolean
  created_at datetime
}

Table sample {
  id varchar [pk]
  barcode varchar
  appointment_id varchar [ref: > appointment.id]
  collected_at datetime
  status SampleStatus
}

Table lab_result {
  id varchar [pk]
  sample_id varchar [ref: > sample.id]
  uploaded_by varchar [ref: > user.id]
  result_data text
  uploaded_at datetime
}

Table doctor_review {
  id varchar [pk]
  doctor_id varchar [ref: > user.id]
  lab_result_id varchar [ref: > lab_result.id]
  diagnosis text
  notes text
  reviewed_at datetime
}

Table prescription {
  id varchar [pk]
  doctor_review_id varchar [ref: > doctor_review.id]
  medication varchar
  dosage varchar
  instructions text
  delivery_option PrescriptionDeliveryOption
}

Table medical_certificate {
  id varchar [pk]
  user_id varchar [ref: > user.id]
  issued_by varchar [ref: > user.id]
  valid_from date
  valid_until date
  reason text
}

Table access_log {
  id varchar [pk]
  result_id varchar [ref: > lab_result.id]
  accessed_by varchar [ref: > user.id]
  accessed_at datetime
  purpose text
}

Table mobile_clinic {
  id varchar [pk]
  slug varchar [unique]
  location varchar
  team_lead varchar
  schedule datetime
  capacity int
}

Table notification {
  id varchar [pk]
  user_id varchar [ref: > user.id]
  message text
  type NotificationType
  status NotificationStatus
  created_at datetime
}

Table activity_log {
  id varchar [pk]
  user_id varchar [ref: > user.id]
  action varchar
  details text
  created_at datetime
}

Table test {
  id varchar [pk]
  name varchar
  description text
  sample_type varchar
}

Table disease {
  id varchar [pk]
  name varchar
}

Table test_disease {
  id varchar [pk]
  test_id varchar [ref: > test.id]
  disease_id varchar [ref: > disease.id]
}

Table examination_result {
  id varchar [pk]
  lab_result_id varchar [ref: > lab_result.id]
  test_id varchar [ref: > test.id]
  result text
  decision text
}

Table package_test {
  id varchar [pk]
  package_id varchar [ref: > screening_package.id]
  test_id varchar [ref: > test.id]
}
