package com.elevanda.school_client_backend.common;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StandardApiResponse<T> {

    private Boolean success;
    private String message;
    private T data;

}
