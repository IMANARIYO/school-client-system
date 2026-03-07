package com.elevanda.school_client_backend.util;

import com.elevanda.school_client_backend.enums.Permission;
import com.elevanda.school_client_backend.model.User;

public class utils {
    public boolean hasPermission(User user, Permission permission) {
        return user.getRole().getPermissions().contains(permission) ||
                user.getRole().getPermissions().stream()
                        .anyMatch(p -> p.name().endsWith("_FULL"));
    }
}
