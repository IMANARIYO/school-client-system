package com.elevanda.school_client_backend.model;

import com.elevanda.school_client_backend.common.BaseEntity;
import com.elevanda.school_client_backend.enums.Role;
import com.elevanda.school_client_backend.enums.UsersStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends BaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String phone;

    @Column(name = "profile_picture")
    private String profilePicture;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UsersStatus status = UsersStatus.ACTIVE;
    @Column(nullable = false,length = 500)
    @Builder.Default
    private String imageUrl = "https://www.pngall.com/wp-content/uploads/5/Profile.png";
    @Column(length = 100, unique = true)
    private String emailVerificationToken;

    @Column
    private LocalDateTime emailVerificationExpiry;
    @Column(nullable = false)
    @Builder.Default
    private Boolean isEmailVerified = false;

    // =================== OTP Fields ===================
    @Column(length = 6)
    private String otpCode; // stores numeric OTP
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid (E.164 format)")
    @Column(nullable = false, length = 20)
    private String phoneNumber;
    @Column
    private LocalDateTime otpExpiry; // OTP expiration datetime

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPhoneVerified = false;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Parent parent;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Student student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Teacher teacher;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Device> devices;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notification> notifications;




    // =================== Defaults ===================
    @PrePersist
    public void applyDefaults() {
        if (role == null) role = Role.STUDENT;
        if (status == null) status = UsersStatus.ACTIVE;
        if (isEmailVerified == null) isEmailVerified = false;
        if (isPhoneVerified == null) isPhoneVerified = false;
        if (imageUrl == null || imageUrl.isBlank())
            imageUrl = "https://www.pngall.com/wp-content/uploads/5/Profile.png";
    }

    // =================== OTP Helper Methods ===================
    /**
     * Check if the stored OTP is valid (matches and not expired)
     */
    public boolean isOtpValid(String otp) {
        if (otpCode == null || !otpCode.equals(otp)) return true;
        return otpExpiry == null || otpExpiry.isBefore(LocalDateTime.now());
    }

    /**
     * Clear OTP after successful verification
     */
    public void clearOtp() {
        this.otpCode = null;
        this.otpExpiry = null;
    }
}
