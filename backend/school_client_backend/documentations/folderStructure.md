school-client-backend/
├── src/main/java/com/example/schoolclient/
│   ├── config/                  # App configuration (DB, security, JWT, etc.)
│   │   ├── SecurityConfig.java
│   │   ├── JwtFilter.java
│   │   ├── JwtProvider.java
│   │   └── AppConfig.java
│   ├── controller/              # REST API controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   └── FeeController.java
│   ├── service/                 # Business logic
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   └── FeeService.java
│   ├── repository/              # Database access layer
│   │   ├── UserRepository.java
│   │   ├── StudentRepository.java
│   │   └── FeeRepository.java
│   ├── dto/                     # Data Transfer Objects
│   │   ├── UserDto.java
│   │   ├── UserResponse.java
│   │   ├── FeeDto.java
│   │   ├── LoginRequest.java
│   │   └── ApiResponse.java      # Standard response wrapper
│   ├── projection/              # JPA projections for partial queries
│   │   ├── StudentSummary.java
│   │   └── FeeSummary.java
│   ├── model/                   # JPA entity models
│   │   ├── User.java
│   │   ├── Student.java
│   │   ├── FeeAccount.java
│   │   └── Device.java
│   ├── exception/               # Exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── ValidationException.java
│   ├── util/                    # Helper utilities
│   │   ├── PasswordUtil.java
│   │   └── JwtUtil.java
│   └── SchoolClientBackendApplication.java  # Main Spring Boot entry point
├── src/main/resources/
│   ├── application.properties
│   └── application-dev.properties
├── src/test/java/com/example/schoolclient/  # Unit & integration tests
├── pom.xml
└── README.md