package com.elevanda.school_client_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String email;
    private String token;
    private String refreshToken;
}
