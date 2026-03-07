package com.elevanda.school_client_backend.dto;


import com.elevanda.school_client_backend.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO to update a user's role. The role must be a valid value from the Role enum.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRoleRequestDTO {

    @NotNull(message = "Role is required")
    private Role role;
}
